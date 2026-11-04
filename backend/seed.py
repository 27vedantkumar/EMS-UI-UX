from .models import User, Event, Venue, Team
from .database import SessionLocal, engine, Base

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(User).first():
        db.close()
        return

    # Seed Venues
    venues_data = [
        Venue(
            id="V-001",
            block="Block A",
            rooms=[
                {"id": "R-101", "name": "Room 101", "capacity": 30, "tables": 10, "juryAssigned": "Dr. Priya Mehta"},
                {"id": "R-102", "name": "Room 102", "capacity": 25, "tables": 8, "juryAssigned": "Prof. Rajesh Kumar"},
                {"id": "R-103", "name": "Room 103", "capacity": 20, "tables": 6, "juryAssigned": None},
            ]
        ),
        Venue(
            id="V-002",
            block="Block B",
            rooms=[
                {"id": "R-201", "name": "Room 201", "capacity": 35, "tables": 12, "juryAssigned": "Dr. Ananya Desai"},
                {"id": "R-202", "name": "Room 202", "capacity": 28, "tables": 9, "juryAssigned": None},
                {"id": "R-203", "name": "Room 203", "capacity": 22, "tables": 7, "juryAssigned": None},
            ]
        )
    ]
    for v in venues_data:
        db.add(v)

    # Seed Events
    events_data = [
        Event(
            id="E-001",
            name="Smart India Hackathon 2026",
            max_teams=50,
            min_teams=5,
            location="Main Campus — Auditorium Block",
            registration_deadline="2026-11-15",
            participation_fees=500,
            status="active",
            description="36-hour national-level hackathon for innovative solutions"
        ),
        Event(
            id="E-002",
            name="Code Sprint Championship",
            max_teams=30,
            min_teams=3,
            location="CS Department — Lab Complex",
            registration_deadline="2026-11-20",
            participation_fees=200,
            status="active",
            description="Competitive programming contest with live leaderboard"
        ),
        Event(
            id="E-003",
            name="AI Innovation Challenge",
            max_teams=25,
            min_teams=5,
            location="Innovation Hub — 2nd Floor",
            registration_deadline="2026-12-01",
            participation_fees=300,
            status="upcoming",
            description="AI / ML project showcase and pitch competition"
        )
    ]
    for e in events_data:
        db.add(e)

    # Seed Teams
    teams_data = [
        Team(
            id="T-001",
            name="CodeCrafters",
            members=["Rahul Sharma", "Priyanka Verma", "Arjun Reddy", "Meera Nair"],
            event_id="E-001",
            venue_block="Block A",
            room="Room 101",
            table=5,
            registration_status="confirmed",
            fee_paid=True,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-002",
            name="InnoVate",
            members=["Sanjay Kumar", "Anita Singh", "Dev Patel"],
            event_id="E-001",
            venue_block="Block A",
            room="Room 101",
            table=6,
            registration_status="confirmed",
            fee_paid=True,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-003",
            name="ByteForce",
            members=["Vikram Joshi", "Sunita Rao", "Kiran Desai", "Anil Kumar"],
            event_id="E-001",
            venue_block="Block A",
            room="Room 102",
            table=1,
            registration_status="confirmed",
            fee_paid=True,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-004",
            name="TechTitans",
            members=["Deepak Sharma", "Pooja Gupta", "Ravi Teja"],
            event_id="E-001",
            venue_block="Block B",
            room="Room 201",
            table=1,
            registration_status="pending",
            fee_paid=False,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-005",
            name="DataMinds",
            members=["Nisha Patel", "Rohan Mehta", "Swetha Iyer", "Ajay Singh"],
            event_id="E-002",
            venue_block="Block B",
            room="Room 201",
            table=2,
            registration_status="confirmed",
            fee_paid=True,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-006",
            name="AlgoStars",
            members=["Kavya Nair", "Pranav Shetty", "Divya Rao"],
            event_id="E-002",
            venue_block="Block B",
            room="Room 202",
            table=1,
            registration_status="confirmed",
            fee_paid=True,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-007",
            name="NeuralNinjas",
            members=["Ankit Bhat", "Rekha Iyer", "Suresh Nair"],
            event_id="E-003",
            venue_block="Block A",
            room="Room 103",
            table=2,
            registration_status="confirmed",
            fee_paid=True,
            credits=100,
            credit_status="awarded"
        ),
        Team(
            id="T-008",
            name="QuantumCoders",
            members=["Ishaan Das", "Lakshmi Rao", "Manish Jha", "Tanvi Sinha"],
            event_id="E-003",
            venue_block="Block A",
            room="Room 103",
            table=3,
            registration_status="pending",
            fee_paid=False,
            credits=100,
            credit_status="awarded"
        )
    ]
    for t in teams_data:
        db.add(t)

    # Seed Users
    users_data = [
        User(
            id=1,
            username="participant",
            password="demo",
            role="participant",
            name="Rahul Sharma",
            email="rahul.sharma@example.com",
            team_id="T-001"
        ),
        User(
            id=2,
            username="jury",
            password="demo",
            role="jury",
            name="Dr. Priya Mehta",
            email="priya.mehta@example.com",
            jury_id="J-001",
            allocated_venue="Block A",
            allocated_rooms=["Room 101", "Room 102"]
        ),
        User(
            id=3,
            username="coordinator",
            password="demo",
            role="coordinator",
            name="Amit Singh",
            email="amit.singh@example.com",
            coordinator_id="C-001",
            allocated_venue="Block A"
        ),
        User(
            id=4,
            username="organizer",
            password="demo",
            role="organizer",
            name="Dr. Neha Gupta",
            email="neha.gupta@example.com"
        )
    ]
    for u in users_data:
        db.add(u)

    db.commit()
    db.close()

