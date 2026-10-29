// ─── Users ───────────────────────────────────────────────
export const users = [
  {
    id: 1,
    username: 'participant',
    password: 'demo',
    role: 'participant',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    teamId: 'T-001',
  },
  {
    id: 2,
    username: 'jury',
    password: 'demo',
    role: 'jury',
    name: 'Dr. Priya Mehta',
    email: 'priya.mehta@example.com',
    juryId: 'J-001',
    allocatedVenue: 'Block A',
    allocatedRooms: ['Room 101', 'Room 102'],
  },
  {
    id: 3,
    username: 'coordinator',
    password: 'demo',
    role: 'coordinator',
    name: 'Amit Singh',
    email: 'amit.singh@example.com',
    coordinatorId: 'C-001',
    allocatedVenue: 'Block A',
  },
  {
    id: 4,
    username: 'organizer',
    password: 'demo',
    role: 'organizer',
    name: 'Dr. Neha Gupta',
    email: 'neha.gupta@example.com',
  },
]

// ─── Teams ───────────────────────────────────────────────
export const teams = [
  {
    id: 'T-001',
    name: 'CodeCrafters',
    members: ['Rahul Sharma', 'Priyanka Verma', 'Arjun Reddy', 'Meera Nair'],
    event: 'E-001',
    venue: 'Block A',
    room: 'Room 101',
    table: 5,
    registrationStatus: 'confirmed',
    feePaid: true,
  },
  {
    id: 'T-002',
    name: 'InnoVate',
    members: ['Sanjay Kumar', 'Anita Singh', 'Dev Patel'],
    event: 'E-001',
    venue: 'Block A',
    room: 'Room 101',
    table: 6,
    registrationStatus: 'confirmed',
    feePaid: true,
  },
  {
    id: 'T-003',
    name: 'ByteForce',
    members: ['Vikram Joshi', 'Sunita Rao', 'Kiran Desai', 'Anil Kumar'],
    event: 'E-001',
    venue: 'Block A',
    room: 'Room 102',
    table: 1,
    registrationStatus: 'confirmed',
    feePaid: true,
  },
  {
    id: 'T-004',
    name: 'TechTitans',
    members: ['Deepak Sharma', 'Pooja Gupta', 'Ravi Teja'],
    event: 'E-001',
    venue: 'Block B',
    room: 'Room 201',
    table: 1,
    registrationStatus: 'pending',
    feePaid: false,
  },
  {
    id: 'T-005',
    name: 'DataMinds',
    members: ['Nisha Patel', 'Rohan Mehta', 'Swetha Iyer', 'Ajay Singh'],
    event: 'E-002',
    venue: 'Block B',
    room: 'Room 201',
    table: 2,
    registrationStatus: 'confirmed',
    feePaid: true,
  },
  {
    id: 'T-006',
    name: 'AlgoStars',
    members: ['Kavya Nair', 'Pranav Shetty', 'Divya Rao'],
    event: 'E-002',
    venue: 'Block B',
    room: 'Room 202',
    table: 1,
    registrationStatus: 'confirmed',
    feePaid: true,
  },
  {
    id: 'T-007',
    name: 'NeuralNinjas',
    members: ['Ankit Bhat', 'Rekha Iyer', 'Suresh Nair'],
    event: 'E-003',
    venue: 'Block A',
    room: 'Room 103',
    table: 2,
    registrationStatus: 'confirmed',
    feePaid: true,
  },
  {
    id: 'T-008',
    name: 'QuantumCoders',
    members: ['Ishaan Das', 'Lakshmi Rao', 'Manish Jha', 'Tanvi Sinha'],
    event: 'E-003',
    venue: 'Block A',
    room: 'Room 103',
    table: 3,
    registrationStatus: 'pending',
    feePaid: false,
  },
]

// ─── Events ──────────────────────────────────────────────
export const events = [
  {
    id: 'E-001',
    name: 'Smart India Hackathon 2026',
    maxTeams: 50,
    minTeams: 5,
    location: 'Main Campus — Auditorium Block',
    registrationDeadline: '2026-11-15',
    participationFees: 500,
    status: 'active',
    description: '36-hour national-level hackathon for innovative solutions',
  },
  {
    id: 'E-002',
    name: 'Code Sprint Championship',
    maxTeams: 30,
    minTeams: 3,
    location: 'CS Department — Lab Complex',
    registrationDeadline: '2026-11-20',
    participationFees: 200,
    status: 'active',
    description: 'Competitive programming contest with live leaderboard',
  },
  {
    id: 'E-003',
    name: 'AI Innovation Challenge',
    maxTeams: 25,
    minTeams: 5,
    location: 'Innovation Hub — 2nd Floor',
    registrationDeadline: '2026-12-01',
    participationFees: 300,
    status: 'upcoming',
    description: 'AI / ML project showcase and pitch competition',
  },
]

// ─── Venues ──────────────────────────────────────────────
export const venues = [
  {
    id: 'V-001',
    block: 'Block A',
    rooms: [
      { id: 'R-101', name: 'Room 101', capacity: 30, tables: 10, juryAssigned: 'Dr. Priya Mehta' },
      { id: 'R-102', name: 'Room 102', capacity: 25, tables: 8,  juryAssigned: 'Prof. Rajesh Kumar' },
      { id: 'R-103', name: 'Room 103', capacity: 20, tables: 6,  juryAssigned: null },
    ],
  },
  {
    id: 'V-002',
    block: 'Block B',
    rooms: [
      { id: 'R-201', name: 'Room 201', capacity: 35, tables: 12, juryAssigned: 'Dr. Ananya Desai' },
      { id: 'R-202', name: 'Room 202', capacity: 28, tables: 9,  juryAssigned: null },
      { id: 'R-203', name: 'Room 203', capacity: 22, tables: 7,  juryAssigned: null },
    ],
  },
]

// ─── Evaluation criteria ─────────────────────────────────
export const evaluationCriteria = [
  { id: 'C-001', name: 'Innovation',           maxScore: 10, description: 'Originality and creativity of the solution' },
  { id: 'C-002', name: 'Technical Complexity',  maxScore: 10, description: 'Technical depth and implementation quality' },
  { id: 'C-003', name: 'Presentation',          maxScore: 10, description: 'Clarity, delivery, and visual aids' },
  { id: 'C-004', name: 'Feasibility',           maxScore: 10, description: 'Practical applicability and scalability' },
  { id: 'C-005', name: 'Impact',                maxScore: 10, description: 'Potential societal or commercial impact' },
]

// ─── Result-sheet template columns ───────────────────────
export const resultSheetColumns = [
  'Rank',
  'Team ID',
  'Team Name',
  'Venue',
  'Jury Name',
  'Total Score',
]
