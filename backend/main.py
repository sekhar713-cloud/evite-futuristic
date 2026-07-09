import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import engine, Base
from routers import auth, events, rsvp

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Futuristic Evite API", version="1.0.0", docs_url="/api/docs")

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


@app.get("/health")
def health():
    return {"status": "ok", "service": "evite-api"}
