from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # participant, jury, coordinator, organizer
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    team_id = Column(String, ForeignKey("teams.id"), nullable=True)
    jury_id = Column(String, nullable=True)
    coordinator_id = Column(String, nullable=True)
    allocated_venue = Column(String, nullable=True)
    allocated_rooms = Column(JSON, nullable=True)  # List of strings e.g. ["Room 101", "Room 102"]

    team = relationship("Team", back_populates="users", foreign_keys=[team_id])


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)  # e.g. 'E-001'
    name = Column(String, nullable=False)
    max_teams = Column(Integer, default=50)
    min_teams = Column(Integer, default=5)
    location = Column(String, nullable=False)
    registration_deadline = Column(String, nullable=False)
    participation_fees = Column(Integer, default=0)
    status = Column(String, default="active")  # active, upcoming, completed
    description = Column(String, nullable=True)

    teams = relationship("Team", back_populates="event_rel")


class Venue(Base):
    __tablename__ = "venues"

    id = Column(String, primary_key=True, index=True)  # e.g. 'V-001'
    block = Column(String, nullable=False, unique=True)  # e.g. 'Block A'
    rooms = Column(JSON, nullable=False)  # List of dicts: [{ id, name, capacity, tables, juryAssigned }]

    teams = relationship("Team", back_populates="venue_rel")


class Team(Base):
    __tablename__ = "teams"

    id = Column(String, primary_key=True, index=True)  # e.g. 'T-001'
    name = Column(String, nullable=False)
    members = Column(JSON, nullable=False)  # List of strings e.g. ["Rahul", "Priyanka"]
    event_id = Column(String, ForeignKey("events.id"), nullable=False)
    venue_block = Column(String, ForeignKey("venues.block"), nullable=False)
    room = Column(String, nullable=False)  # e.g. 'Room 101'
    table = Column(Integer, nullable=False)  # e.g. 5
    registration_status = Column(String, default="confirmed")  # confirmed, pending
    fee_paid = Column(Boolean, default=True)
    credits = Column(Integer, default=100)
    credit_status = Column(String, default="awarded")  # awarded, reduced, not-awarded

    users = relationship("User", back_populates="team", foreign_keys="User.team_id")
    event_rel = relationship("Event", back_populates="teams")
    venue_rel = relationship("Venue", back_populates="teams")
    evaluations = relationship("Evaluation", back_populates="team_rel")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    team_id = Column(String, ForeignKey("teams.id"), nullable=False)
    jury_id = Column(String, nullable=True)
    jury_name = Column(String, nullable=False)
    room = Column(String, nullable=True)
    scores = Column(JSON, nullable=False)  # { 'C-001': 8, ... }
    total_score = Column(Integer, default=0)
    remarks = Column(String, default="")
    created_at = Column(String, nullable=True)

    team_rel = relationship("Team", back_populates="evaluations")

