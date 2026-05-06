# Full-Stack Code Execution Platform

A production-style competitive programming and collaborative coding platform built with a modern full-stack architecture.

This project combines:

* Secure Docker-based C++ code execution
* Real-time multiplayer contest rooms
* Live leaderboard broadcasting with Socket.IO
* AI-powered time/space complexity analysis using Gemini
* Queue-based asynchronous submission processing
* Redis caching
* JWT authentication
* Monaco-powered in-browser code editor

The platform is designed to simulate the architecture of real online judges like Codeforces, LeetCode, HackerRank, or CodeChef while still remaining understandable and extensible for learning purposes.

---

# Table of Contents

1. Overview
2. Core Features
3. System Architecture
4. Tech Stack
5. Folder Structure
6. Backend Architecture
7. Frontend Architecture
8. Submission Execution Pipeline
9. Real-Time Contest System
10. Redis Usage
11. AI Complexity Analysis
12. Database Design
13. Authentication Flow
14. API Routes
15. Docker Sandbox Execution
16. Security Considerations
17. Local Development Setup
18. Environment Variables
19. Running the Project
20. Example Workflow
21. Scalability Discussion
22. Known Limitations
23. Future Improvements
24. Why This Project Matters
25. Screens and Functionalities
26. Resume Value
27. License

---

# Overview

This repository implements a complete online judge ecosystem.

Users can:

* Register and login securely
* Browse coding problems
* Write C++ code directly in the browser
* Submit solutions
* Get verdicts asynchronously
* Participate in multiplayer coding rooms
* See real-time leaderboard updates
* Analyze algorithm complexity using AI

Unlike simple CRUD projects, this platform includes:

* Distributed-system style workflows
* Asynchronous job processing
* Docker isolation
* Real-time communication
* Caching
* Queue processing
* External AI integration
* Multi-user synchronization

This makes the project significantly closer to real-world backend systems.

---

# Core Features

## Online Judge Features

* Code submission system
* Asynchronous submission processing
* Testcase execution
* Execution verdict generation
* Time limit handling
* Memory limit enforcement
* Compiler/runtime error handling
* Secure containerized execution

## Collaborative Contest Features

* Room creation system
* Join room using room code
* Shared contest participation
* Real-time leaderboard updates
* Live room synchronization using websockets

## AI Features

* Automatic time complexity analysis
* Automatic space complexity analysis
* Gemini API integration
* Structured JSON response parsing

## Frontend Features

* Monaco editor integration
* SPA routing with React Router
* JWT-based session persistence
* Responsive contest pages
* Live verdict updates
* Authentication UI

## Backend Features

* REST API architecture
* Service-controller separation
* Socket.IO integration
* Redis caching
* PostgreSQL/Knex integration
* Queue-style worker processing
* Docker orchestration from Node.js

---

# System Architecture

```text
Frontend (React + Monaco + Socket.IO)
            |
            v
Backend API Layer (Express)
            |
            +--------------------+
            |                    |
            v                    v
Authentication            Submission Queue
(JWT + bcrypt)            (Database-driven)
                                 |
                                 v
                         Worker Process
                                 |
                                 v
                    Docker Sandbox Execution
                                 |
                                 v
                      Verdict + Leaderboard
                                 |
                                 v
                      Socket.IO Broadcast
                                 |
                                 v
                        Real-Time Frontend
```

---

# Tech Stack

## Frontend

* React 19
* Vite
* React Router DOM
* Monaco Editor
* Socket.IO Client
* JWT Decode

## Backend

* Node.js
* Express.js
* Socket.IO
* Knex.js
* Redis
* PostgreSQL
* Docker
* bcrypt
* JWT

## AI

* Google Gemini 2.5 Flash API

## Infrastructure Concepts

* Containerization
* Sandboxed execution
* Real-time communication
* Asynchronous workers
* Queue processing
* Caching

---

# Folder Structure

```text
Full-Stack-Code-Execution-Platform/
│
├── backend/
│   └── myapp/
│       ├── config/
│       ├── controllers/
│       ├── db/
│       │   └── migrations/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── temp/
│       ├── worker.js
│       ├── socket-server.js
│       └── index.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── Dockerfile
└── README.md
```

---

# Backend Architecture

The backend follows a layered architecture.

## Route Layer

Responsible for:

* Defining endpoints
* Mapping requests to controllers

Examples:

* `/problems`
* `/submissions`
* `/rooms`
* `/auth`
* `/analysis`

---

## Controller Layer

Responsible for:

* Request validation
* Extracting payloads
* Calling services
* Returning responses

Example:

```js
const analyzeController = async(req, res) => {
    const code = req.body.code;
    const response = await analyzeService(code);
    res.json(response);
}
```

This keeps controllers thin and maintainable.

---

## Service Layer

Contains business logic.

Examples:

* Room creation
* Submission insertion
* AI analysis
* Leaderboard generation
* Contest management

This separation improves:

* Scalability
* Testability
* Maintainability
* Readability

---

## Worker Layer

`worker.js` acts as the asynchronous execution engine.

Responsibilities:

* Poll pending submissions
* Mark jobs as in progress
* Create temporary execution directories
* Compile code
* Run code inside Docker
* Compare outputs
* Generate verdicts
* Update database
* Emit live leaderboard events

This architecture mimics real online judges.

---

# Frontend Architecture

The frontend is built using React + Vite.

## Main Pages

### HomePage

Displays:

* Available problems
* Navigation
* Contest entry points

### ProblemPage

Contains:

* Problem statement
* Monaco code editor
* Submit button
* AI analysis button
* Verdict display

### AuthPage

Authentication gateway for:

* Login
* Registration

### RoomsPage

Used for:

* Creating contest rooms
* Joining existing rooms

### RoomPage

Displays:

* Contest problems
* Participants
* Real-time leaderboard
* Live synchronization

---

## Monaco Editor Integration

The project integrates Monaco Editor for a VSCode-like coding experience.

Benefits:

* Syntax highlighting
* Better coding UX
* Real editor feel
* Competitive programming environment simulation

---

# Submission Execution Pipeline

The execution pipeline is the core engineering highlight of the project.

## Step 1: User Submission

Frontend sends:

```json
{
  "problem_id": 1,
  "user_id": 5,
  "language": "cpp",
  "code": "..."
}
```

Submission status initially becomes:

```text
Pending
```

---

## Step 2: Queue Pickup

`worker.js` continuously polls the database.

It atomically updates one pending job:

```js
.where('status', 'Pending')
.orderBy('submission_id', 'asc')
.limit(1)
```

This creates a FIFO-style processing queue.

---

## Step 3: Temporary Sandbox Creation

For each submission:

```text
/temp/{submission_id}/
```

Files generated:

```text
main.cpp
input.txt
main
```

This isolates execution environments.

---

## Step 4: Docker Compilation and Execution

The backend dynamically creates a Docker command:

```bash
docker run --rm \
  --memory=128m \
  -v submission_dir:/app \
  -w /app \
  --network none \
  learningwhim/cpp-runner:latest
```

Key protections:

| Feature              | Purpose                 |
| -------------------- | ----------------------- |
| `--network none`     | Prevent internet access |
| `--memory`           | Prevent memory abuse    |
| isolated mount       | File isolation          |
| disposable container | No persistence          |

This is one of the most important engineering components in the project.

---

## Step 5: Verdict Generation

The worker determines:

* Accepted
* Wrong Answer
* Runtime Error
* Compilation Error
* Time Limit Exceeded

Then updates the database.

---

## Step 6: Real-Time Broadcast

After processing:

```js
io.to(roomCode).emit(...)
```

Leaderboard updates are instantly pushed to all users.

---

# Real-Time Contest System

One of the strongest features in the repository.

## Room Creation

Rooms are generated using NanoID.

Example:

```text
AB12cd
```

Each room:

* Has participants
* Has assigned problems
* Tracks submissions
* Maintains rankings

---

## Socket.IO Integration

Socket.IO enables:

* Instant room joins
* Live synchronization
* Leaderboard broadcasting
* Multiplayer contest feel

Connection flow:

```js
socket.on("join-room", ({roomCode, user_id}) => {
    socket.join(roomCode);
});
```

This creates isolated websocket channels per contest room.

---

## Leaderboard Logic

Leaderboard updates occur after:

* New accepted submissions
* Score changes
* Contest progress updates

This replicates real competitive programming systems.

---

# Redis Usage

Redis is used primarily for caching.

Example:

```js
const key_room_problems = `roomProblems:${room.room_id}`;
```

Benefits:

* Faster room retrieval
* Reduced database load
* Lower latency
* Better scalability

The backend also verifies Redis connectivity during startup.

---

# AI Complexity Analysis

The platform integrates Gemini for algorithm analysis.

## Workflow

1. User submits source code
2. Backend sends prompt to Gemini
3. AI returns JSON
4. Frontend displays complexity

Example response:

```json
{
  "timeComplexity": "O(n log n)",
  "spaceComplexity": "O(n)"
}
```

---

## Why This Feature Matters

Most student online judges only execute code.

This project additionally:

* Interprets algorithms
* Provides educational feedback
* Demonstrates AI integration in software systems

This significantly increases the project's uniqueness.

---

# Database Design

The project uses relational database modeling with migrations.

## Important Tables

### users

Stores:

* user_id
* username
* password hash

---

### problems

Stores:

* title
* statement
* constraints
* limits

---

### testcases

Stores:

* input
* expected output
* linked problem_id

---

### submissions

Stores:

* user_id
* problem_id
* code
* verdict
* output
* room_id

---

### rooms

Stores:

* room_code
* creator_id

---

### room_participants

Tracks:

* contest participants

---

### room_problems

Maps:

* rooms to problems

---

# Authentication Flow

Authentication is implemented using:

* JWT
* bcrypt

## Registration

Passwords are hashed before storage.

## Login

JWT token is generated and sent to frontend.

## Protected Routes

Middleware verifies token validity.

Benefits:

* Stateless authentication
* Better scalability
* Standard production architecture

---

# API Routes

## Authentication

```text
POST /auth/register
POST /auth/login
```

---

## Problems

```text
GET /problems
GET /problems/:id
POST /problems
```

---

## Submissions

```text
POST /submit
GET /submission/:id
```

---

## AI Analysis

```text
POST /analyze
```

---

## Rooms

```text
POST /rooms/create
POST /rooms/join
GET /rooms/:roomCode
```

---

# Docker Sandbox Execution

The project executes untrusted code.

Without isolation, users could:

* Access server files
* Consume excessive memory
* Crash the server
* Execute malicious commands

Docker prevents this.

## Security Controls Used

| Control               | Purpose                   |
| --------------------- | ------------------------- |
| Network disabled      | Prevent external access   |
| Memory cap            | Prevent memory exhaustion |
| Disposable containers | Remove persistence        |
| Isolated temp folders | Prevent cross-user access |

This demonstrates understanding of secure execution environments.

---

# Security Considerations

Implemented protections:

* JWT authentication
* Password hashing with bcrypt
* Docker isolation
* Network-disabled containers
* Input/output separation
* Temporary execution folders
* Controlled execution pipeline

Areas for future hardening:

* CPU quotas
* Better rate limiting
* Sandboxing beyond Docker
* Multi-testcase batching
* Static analysis validation

---

# Local Development Setup

## Prerequisites

Install:

* Node.js
* Docker
* Redis
* PostgreSQL

---

## Clone Repository

```bash
git clone <repo-url>
cd Full-Stack-Code-Execution-Platform
```

---

## Backend Setup

```bash
cd backend/myapp
npm install
```

Run migrations:

```bash
npx knex migrate:latest
```

Start backend:

```bash
node index.js
```

Start worker:

```bash
node worker.js
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Backend `.env`

```env
CLIENT_ORIGIN_URL=http://localhost:5173
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL=postgresql_connection
```

---

# Running the Project

## Start Redis

```bash
redis-server
```

---

## Start Backend

```bash
node index.js
```

---

## Start Worker

```bash
node worker.js
```

---

## Start Frontend

```bash
npm run dev
```

---

# Example Workflow

## User Journey

1. Register account
2. Login
3. Open a problem
4. Write C++ solution
5. Submit code
6. Worker processes submission
7. Docker executes code
8. Verdict returned
9. Join contest room
10. Compete live with others
11. Leaderboard updates instantly
12. Analyze complexity using AI

---

# Scalability Discussion

Current architecture already introduces scalable concepts.

## Good Architectural Decisions

### Worker Separation

Execution logic is decoupled from API requests.

Benefits:

* Better responsiveness
* Easier scaling
* Queue-style architecture

---

### Redis Caching

Reduces repetitive DB hits.

---

### Socket.IO Rooms

Efficient real-time segmentation.

---

### Service Layer Separation

Improves maintainability.

---

## Future Scalability Improvements

Potential upgrades:

* Dedicated message queue (RabbitMQ/Kafka/BullMQ)
* Kubernetes worker orchestration
* Horizontal scaling
* Distributed execution nodes
* Judge sharding
* Multiple language support
* Persistent contest history
* Code plagiarism detection
* Rate limiting
* Autoscaling workers

---

# Known Limitations

Current limitations include:

* Primarily C++ focused
* Single-worker execution model
* Polling-based queue instead of event-driven queue
* Limited sandbox hardening
* Basic testcase handling
* No distributed execution cluster

These are acceptable tradeoffs for an educational full-stack systems project.

---

# Future Improvements

Possible enhancements:

## Competitive Programming Features

* Multiple testcases per problem
* Partial scoring
* Contest timers
* Editorials
* Tags and difficulty filters
* Submission history
* Virtual contests

---

## Infrastructure Features

* Kubernetes deployment
* RabbitMQ/BullMQ integration
* Distributed workers
* CI/CD pipeline
* Monitoring dashboards
* Container pooling

---

## Security Features

* seccomp profiles
* gVisor/firecracker isolation
* CPU throttling
* Better filesystem restrictions

---

## AI Features

* Code review suggestions
* Optimization hints
* Bug detection
* Dry run explanations
* Complexity visualization

---

# Why This Project Matters

This is not a simple CRUD application.

The project demonstrates understanding of:

* Full-stack development
* Distributed systems concepts
* Docker sandboxing
* Real-time communication
* Backend architecture
* Queue processing
* Authentication
* Database design
* AI integration
* System scalability
* Competitive programming infrastructure

Very few student projects combine all of these together.

---

# Screens and Functionalities

## Functional Areas

| Module            | Function                |
| ----------------- | ----------------------- |
| Authentication    | Register/Login          |
| Problem System    | View and solve problems |
| Monaco Editor     | Write C++ code          |
| Submission Engine | Execute code            |
| Worker            | Async processing        |
| Docker Sandbox    | Secure execution        |
| Contest Rooms     | Multiplayer coding      |
| Socket.IO         | Real-time updates       |
| Redis             | Caching                 |
| Gemini AI         | Complexity analysis     |

---

# Resume Value

This project is strong for:

* Backend engineering internships
* Systems engineering roles
* Full-stack roles
* Platform engineering
* Developer tools
* Infrastructure-focused internships

Especially because it demonstrates:

* Real architecture decisions
* Security awareness
* Concurrency understanding
* Queue systems
* Realtime systems
* Docker usage
* AI integration

This is significantly stronger than generic MERN CRUD applications.

---

# License

This project is open-source and intended for educational and portfolio purposes.

You may modify and extend it according to your requirements.

---

# Final Notes

This repository represents a strong systems-oriented full-stack project.

The combination of:

* sandboxed execution,
* websocket synchronization,
* async workers,
* Redis caching,
* AI integration,
* and contest infrastructure

makes it substantially more advanced than typical beginner projects.

It demonstrates practical software engineering concepts used in real online judge platforms and collaborative coding systems.
