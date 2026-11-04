from pydantic import BaseModel
from typing import List, Optional, Any, Dict

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    name: str
    email: str
    teamId: Optional[str] = None
    juryId: Optional[str] = None
    coordinatorId: Optional[str] = None
    allocatedVenue: Optional[str] = None
    allocatedRooms: Optional[List[str]] = None

    class Config:
        from_attributes = True

# --- Team Schemas ---
class TeamBase(BaseModel):
    name: str
    members: List[str]
    event: str
    venue: str
    room: str
    table: int
    registrationStatus: str = "confirmed"
    feePaid: bool = True
    credits: int = 100
    creditStatus: str = "awarded"

class TeamResponse(TeamBase):
    id: str

    class Config:
        from_attributes = True

# --- Event Schemas ---
class EventBase(BaseModel):
    name: str
    maxTeams: int
    minTeams: int
    location: str
    registrationDeadline: str
    participationFees: int
    status: str = "active"
    description: Optional[str] = ""

class EventCreate(EventBase):
    id: Optional[str] = None

class EventUpdate(BaseModel):
    name: Optional[str] = None
    maxTeams: Optional[int] = None
    minTeams: Optional[int] = None
    location: Optional[str] = None
    registrationDeadline: Optional[str] = None
    participationFees: Optional[int] = None
    status: Optional[str] = None
    description: Optional[str] = None

class EventResponse(EventBase):
    id: str

    class Config:
        from_attributes = True

# --- Venue Schemas ---
class RoomSchema(BaseModel):
    id: str
    name: str
    capacity: int
    tables: int
    juryAssigned: Optional[str] = None

class VenueBase(BaseModel):
    block: str
    rooms: List[RoomSchema]

class VenueResponse(VenueBase):
    id: str

    class Config:
        from_attributes = True

# --- Participant Specific Schemas ---
class ParticipantVenueResponse(BaseModel):
    teamId: str
    teamName: str
    registrationStatus: str
    feePaid: bool
    event: str
    eventName: Optional[str] = ""
    eventDescription: Optional[str] = ""
    location: Optional[str] = ""
    registrationDeadline: Optional[str] = ""
    participationFees: Optional[int] = 0
    venue: str
    room: str
    table: int
    members: List[str]

# --- Evaluation Schemas ---
class EvaluationCreate(BaseModel):
    teamId: str
    juryId: Optional[str] = None
    juryName: str
    room: Optional[str] = None
    scores: Dict[str, int]
    totalScore: int
    remarks: Optional[str] = ""

class EvaluationResponse(BaseModel):
    id: int
    teamId: str
    teamName: Optional[str] = None
    juryId: Optional[str] = None
    juryName: str
    room: Optional[str] = None
    scores: Dict[str, int]
    totalScore: int
    remarks: Optional[str] = ""
    createdAt: Optional[str] = None

# --- Credit Update Schema ---
class CreditUpdateRequest(BaseModel):
    credits: int
    status: str  # awarded, reduced, not-awarded

