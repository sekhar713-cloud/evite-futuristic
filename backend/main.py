import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from database import engine, Base
from routers import auth, events, rsvp, debug
from routers import google_auth

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Futuristic Evite API", version="1.0.0", docs_url="/api/docs")

# SessionMiddleware is required by authlib for OAuth state/nonce
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "dev-secret-change-in-production"),
    same_site="lax",
    https_only=os.getenv("BASE_URL", "").startswith("https://"),
)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(rsvp.router)
app.include_router(debug.router)
app.include_router(google_auth.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "evite-api"}


# Serve built React frontend (production only — in dev, Vite proxy handles this)
_DIST = Path(__file__).parent.parent / "frontend" / "dist"
if _DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=_DIST / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        file = _DIST / full_path
        if file.is_file():
            return FileResponse(file)
        return FileResponse(_DIST / "index.html")
