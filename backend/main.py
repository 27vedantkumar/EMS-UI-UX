from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from .database import engine, Base, get_db
from .models import User, Event, Venue, Team, Evaluation
from .schemas import (
    LoginRequest, UserResponse,
    TeamResponse, TeamBase,
    EventResponse, EventCreate, EventUpdate,
    VenueResponse,
    ParticipantVenueResponse,
    EvaluationCreate, EvaluationResponse,
    CreditUpdateRequest
)
from .seed import seed_database

# Create all tables & populate seed records if empty
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(title="EMS - Event Management System API", version="1.0.0")

# Setup CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def serialize_team(t: Team) -> dict:
    return {
        "id": t.id,
        "name": t.name,
        "members": t.members,
        "event": t.event_id,
        "venue": t.venue_block,
        "room": t.room,
        "table": t.table,
        "registrationStatus": t.registration_status,
        "feePaid": t.fee_paid,
        "credits": t.credits,
        "creditStatus": t.credit_status
    }

def serialize_user(u: User) -> dict:
    return {
        "id": u.id,
        "username": u.username,
        "role": u.role,
        "name": u.name,
        "email": u.email,
        "teamId": u.team_id,
        "juryId": u.jury_id,
        "coordinatorId": u.coordinator_id,
        "allocatedVenue": u.allocated_venue,
        "allocatedRooms": u.allocated_rooms
    }

def serialize_event(e: Event) -> dict:
    return {
        "id": e.id,
        "name": e.name,
        "maxTeams": e.max_teams,
        "minTeams": e.min_teams,
        "location": e.location,
        "registrationDeadline": e.registration_deadline,
        "participationFees": e.participation_fees,
        "status": e.status,
        "description": e.description or ""
    }

def serialize_venue(v: Venue) -> dict:
    return {
        "id": v.id,
        "block": v.block,
        "rooms": v.rooms
    }

# --- AUTH & USERS ---
@app.post("/api/v1/auth/login", response_model=UserResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == creds.username, User.password == creds.password).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return serialize_user(user)

@app.get("/api/v1/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [serialize_user(u) for u in users]

# --- PARTICIPANTS ---
@app.get("/api/v1/participants/{user_or_team_id}/venue", response_model=ParticipantVenueResponse)
def get_participant_venue(user_or_team_id: str, db: Session = Depends(get_db)):
    # Can query by user ID (int or str) or team ID
    team = None
    if user_or_team_id.isdigit():
        user = db.query(User).filter(User.id == int(user_or_team_id)).first()
        if user and user.team_id:
            team = db.query(Team).filter(Team.id == user.team_id).first()
    
    if not team:
        team = db.query(Team).filter(Team.id == user_or_team_id).first()
    
    if not team:
        raise HTTPException(status_code=404, detail="Participant team/venue allocation not found")

    event = db.query(Event).filter(Event.id == team.event_id).first()

    return {
        "teamId": team.id,
        "teamName": team.name,
        "registrationStatus": team.registration_status,
        "feePaid": team.fee_paid,
        "event": team.event_id,
        "eventName": event.name if event else "",
        "eventDescription": event.description if event else "",
        "location": event.location if event else "",
        "registrationDeadline": event.registration_deadline if event else "",
        "participationFees": event.participation_fees if event else 0,
        "venue": team.venue_block,
        "room": team.room,
        "table": team.table,
        "members": team.members
    }

# --- TEAMS ---
@app.get("/api/v1/teams", response_model=List[TeamResponse])
def get_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return [serialize_team(t) for t in teams]

@app.patch("/api/v1/teams/{team_id}/credits", response_model=TeamResponse)
def update_team_credits(team_id: str, payload: CreditUpdateRequest, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.credits = payload.credits
    team.credit_status = payload.status
    db.commit()
    db.refresh(team)
    return serialize_team(team)

# --- EVENTS ---
@app.get("/api/v1/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return [serialize_event(e) for e in events]

@app.post("/api/v1/organizer/event", response_model=EventResponse)
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    event_id = payload.id
    if not event_id:
        count = db.query(Event).count() + 1
        event_id = f"E-{count:03d}"
    
    new_event = Event(
        id=event_id,
        name=payload.name,
        max_teams=payload.maxTeams,
        min_teams=payload.minTeams,
        location=payload.location,
        registration_deadline=payload.registrationDeadline,
        participation_fees=payload.participationFees,
        status=payload.status,
        description=payload.description
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return serialize_event(new_event)

@app.put("/api/v1/organizer/event/{event_id}", response_model=EventResponse)
def update_event(event_id: str, payload: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if payload.name is not None: event.name = payload.name
    if payload.maxTeams is not None: event.max_teams = payload.maxTeams
    if payload.minTeams is not None: event.min_teams = payload.minTeams
    if payload.location is not None: event.location = payload.location
    if payload.registrationDeadline is not None: event.registration_deadline = payload.registrationDeadline
    if payload.participationFees is not None: event.participation_fees = payload.participationFees
    if payload.status is not None: event.status = payload.status
    if payload.description is not None: event.description = payload.description

    db.commit()
    db.refresh(event)
    return serialize_event(event)

# --- VENUES ---
@app.get("/api/v1/venues", response_model=List[VenueResponse])
def get_venues(db: Session = Depends(get_db)):
    venues = db.query(Venue).all()
    return [serialize_venue(v) for v in venues]

# --- EVALUATIONS (JURY) ---
@app.get("/api/v1/evaluations", response_model=List[EvaluationResponse])
def get_evaluations(db: Session = Depends(get_db)):
    evals = db.query(Evaluation).all()
    res = []
    for ev in evals:
        team = db.query(Team).filter(Team.id == ev.team_id).first()
        res.append({
            "id": ev.id,
            "teamId": ev.team_id,
            "teamName": team.name if team else ev.team_id,
            "juryId": ev.jury_id,
            "juryName": ev.jury_name,
            "room": ev.room,
            "scores": ev.scores,
            "totalScore": ev.total_score,
            "remarks": ev.remarks,
            "createdAt": ev.created_at
        })
    return res

@app.post("/api/v1/evaluations", response_model=EvaluationResponse)
def submit_evaluation(payload: EvaluationCreate, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == payload.teamId).first()
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    new_eval = Evaluation(
        team_id=payload.teamId,
        jury_id=payload.juryId,
        jury_name=payload.juryName,
        room=payload.room,
        scores=payload.scores,
        total_score=payload.totalScore,
        remarks=payload.remarks or "",
        created_at=now_str
    )
    db.add(new_eval)
    db.commit()
    db.refresh(new_eval)

    return {
        "id": new_eval.id,
        "teamId": new_eval.team_id,
        "teamName": team.name if team else new_eval.team_id,
        "juryId": new_eval.jury_id,
        "juryName": new_eval.jury_name,
        "room": new_eval.room,
        "scores": new_eval.scores,
        "totalScore": new_eval.total_score,
        "remarks": new_eval.remarks,
        "createdAt": new_eval.created_at
    }

