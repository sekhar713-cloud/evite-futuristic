from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from uuid import UUID
from enum import Enum


class RSVPStatus(str, Enum):
    yes = "yes"
    no = "no"
    maybe = "maybe"


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None
    location_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    theme: str = "cosmic"
    max_guests: Optional[int] = None
    is_public: bool = True


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    location_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    theme: Optional[str] = None
    max_guests: Optional[int] = None
    is_public: Optional[bool] = None


class RSVPCounts(BaseModel):
    yes: int = 0
    no: int = 0
    maybe: int = 0


class EventResponse(BaseModel):
    id: UUID
    slug: str
    title: str
    description: Optional[str]
    event_date: datetime
    location: Optional[str]
    location_url: Optional[str]
    cover_image_url: Optional[str]
    theme: str
    max_guests: Optional[int]
    is_public: bool
    organizer_id: UUID
    organizer: Optional[UserResponse] = None
    created_at: datetime
    rsvp_counts: Optional[RSVPCounts] = None

    model_config = {"from_attributes": True}


class RSVPCreate(BaseModel):
    name: str
    email: EmailStr
    status: RSVPStatus
    message: Optional[str] = None


class RSVPResponse(BaseModel):
    id: UUID
    event_id: UUID
    name: str
    email: str
    status: RSVPStatus
    message: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
