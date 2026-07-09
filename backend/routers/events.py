import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas
import models
import auth
from database import get_db

router = APIRouter(prefix="/events", tags=["events"])


def _make_slug(title: str, db: Session) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:60]
    slug, n = base, 0
    while db.query(models.Event).filter(models.Event.slug == slug).first():
        n += 1
        slug = f"{base}-{n}"
    return slug


def _rsvp_counts(event: models.Event) -> schemas.RSVPCounts:
    counts = {"yes": 0, "no": 0, "maybe": 0}
    for r in event.rsvps:
        counts[r.status.value] += 1
    return schemas.RSVPCounts(**counts)


@router.get("/", response_model=List[schemas.EventResponse])
def get_my_events(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    events = (
        db.query(models.Event)
        .filter(models.Event.organizer_id == current_user.id)
        .order_by(models.Event.event_date.desc())
        .all()
    )
    result = []
    for e in events:
        data = schemas.EventResponse.model_validate(e)
        data.rsvp_counts = _rsvp_counts(e)
        result.append(data)
    return result


@router.post("/", response_model=schemas.EventResponse)
def create_event(
    event_data: schemas.EventCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    event = models.Event(
        **event_data.model_dump(),
        slug=_make_slug(event_data.title, db),
        organizer_id=current_user.id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    data = schemas.EventResponse.model_validate(event)
    data.rsvp_counts = _rsvp_counts(event)
    return data


@router.get("/{slug}", response_model=schemas.EventResponse)
def get_event(slug: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.slug == slug).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    data = schemas.EventResponse.model_validate(event)
    data.rsvp_counts = _rsvp_counts(event)
    return data


@router.put("/{slug}", response_model=schemas.EventResponse)
def update_event(
    slug: str,
    event_data: schemas.EventUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(models.Event).filter(models.Event.slug == slug).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in event_data.model_dump(exclude_none=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    data = schemas.EventResponse.model_validate(event)
    data.rsvp_counts = _rsvp_counts(event)
    return data


@router.delete("/{slug}", status_code=204)
def delete_event(
    slug: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    event = db.query(models.Event).filter(models.Event.slug == slug).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(event)
    db.commit()
