# Full Stack Real-Time Code Execution & Contest Platform

A high-performance, full-stack application for competitive programming contests, designed for real-time collaboration and secure code execution. This project demonstrates proficiency in building modern, scalable, and secure distributed systems.

---

## 🚀 Core Features

- **Real-Time Contests:** Implemented a **Hybrid Architecture** using **WebSockets (Socket.IO)** to manage live score synchronization and instant leaderboard updates for multi-problem contests.
- **Secure Code Execution:** Uses **Docker** to create isolated, resource-limited sandboxes for running untrusted C++ code, ensuring system integrity and preventing exploits.
- **Professional Architecture:** Backend is structured using the **Service-Controller-Route (S-C-R)** pattern, making the codebase modular, testable, and highly maintainable.
- **Full Authentication:** Built a secure token-based system using **bcrypt** for password hashing and **JSON Web Tokens (JWT)** for session management and route protection.
- **Database Integrity:** Utilizes **PostgreSQL** and **Knex.js** with **database transactions** to ensure "all-or-nothing" integrity when creating contest rooms and linking problems.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js, **Socket.IO** |
| **Database** | PostgreSQL, **Knex.js** (Migrations & Query Builder) |
| **Security** | **JWT**, **bcrypt** |
| **Frontend** | React.js, Vite, React Router |
| **DevOps** | **Docker**, Git |

---

## 💻 Local Development Setup

To run this project, you need two terminals open (one for the Backend and one for the Frontend).

### Step 1: Prerequisites

1.  **Start Docker:** Ensure Docker Desktop is running, as it is required for code execution.
2.  **Create Supabase DB:** Set up your PostgreSQL database (used for persistence).

### Step 2: Backend Setup

1.  **Navigate:** `cd backend/myapp`
2.  **Install:** `npm install`
3.  **Configure:** Create a `.env` file with your database and JWT secrets (e.g., `JWT_SECRET=your_secret`, `DB_HOST`, `DB_USER`).
4.  **Migrate:** Run migrations to create all tables (`problems`, `users`, `rooms`, etc.):
    ```bash
    npx knex migrate:latest
    ```
5.  **Run:** Start the server.
    ```bash
    node index.js
    ```

### Step 3: Frontend Setup

1.  **Navigate (New Terminal):** `cd frontend`
2.  **Install:** `npm install`
3.  **Run:** Start the client application.
    ```bash
    npm run dev
    ```
    The app will open in your browser on `http://localhost:5173`.

---
