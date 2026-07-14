import os
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import models
import auth as auth_utils
from database import get_db

router = APIRouter()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID", ""),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET", ""),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/auth/google", include_in_schema=False)
async def auth_google(request: Request):
    redirect_uri = str(request.url_for("auth_callback"))
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/auth/callback", name="auth_callback", include_in_schema=False)
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        return RedirectResponse(url="/login?error=oauth_failed", status_code=303)

    userinfo = token.get("userinfo") or {}
    google_id = str(userinfo.get("sub", ""))
    email = userinfo.get("email", "")
    name = userinfo.get("name") or email.split("@")[0]
    picture = userinfo.get("picture")

    if not google_id or not email:
        return RedirectResponse(url="/login?error=no_profile", status_code=303)

    # Find existing user by google_id, then fall back to email (links existing password account)
    user = db.query(models.User).filter(models.User.google_id == google_id).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        user.google_id = google_id
        user.picture = picture
        user.name = name
    else:
        # Derive a unique username from the email local part
        base = email.split("@")[0].replace(".", "_").replace("+", "_")[:30]
        username, n = base, 0
        while db.query(models.User).filter(models.User.username == username).first():
            n += 1
            username = f"{base}{n}"

        user = models.User(
            email=email,
            username=username,
            name=name,
            google_id=google_id,
            picture=picture,
            password_hash=None,
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    jwt = auth_utils.create_access_token({"sub": str(user.id)})
    return RedirectResponse(url=f"/auth/success?token={jwt}", status_code=303)
