from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas
import models
import auth
from database import get_db

router = APIRouter(tags=["rsvp"])


@router.post("/events/{slug}/rsvp", response_model=schemas.RSVPResponse)
def submit_rsvp(slug: str, rsvp_data: schemas.RSVPCreate, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.slug == slug).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    existing = (
        db.query(models.RSVP)
        .filter(models.RSVP.event_id == event.id, models.RSVP.email == rsvp_data.email)
        .first()
    )
    if existing:
        for field, value in rsvp_data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    rsvp = models.RSVP(**rsvp_data.model_dump(), event_id=event.id)
    db.add(rsvp)
    db.commit()
    db.refresh(rsvp)
    return rsvp


@router.get("/events/{slug}/rsvps", response_model=List[schemas.RSVPResponse])
def get_rsvps(
    slug: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(models.Event).filter(models.Event.slug == slug).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return event.rsvps
