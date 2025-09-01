# Full-Stack Code Execution Platform

A comprehensive web application that allows users to solve coding problems, submit solutions, and receive real-time feedback, built with a modern, scalable architecture. This project is fully configured for local development and testing.

---

## Tech Stack

This project uses a decoupled frontend/backend architecture.

| Category           | Technology                               |
| :----------------- | :--------------------------------------- |
| **Frontend** | React (Vite), React Router               |
| **Backend** | Node.js, Express.js                      |
| **Database** | PostgreSQL (managed by Supabase)         |
| **Database ORM** | Knex.js (Query Builder & Migrations)     |
| **Code Execution** | Docker                                   |

### Planned Deployment

| Platform           | Service          |
| :----------------- | :--------------- |
| **Frontend Hosting** | Vercel           |
| **Backend Hosting** | Render           |



---

## Features

- **Problem Library:** Fetches and displays a list of coding problems from the database.
- **Detailed Problem View:** Users can view a single problem's full statement, time limit, and memory limit.
- **Code Editor:** A dedicated page with a text area for writing and submitting code.
- **Code Submission:** Users can submit their C++ code to the backend for execution.
- **Secure Code Execution:** The backend uses Docker to run untrusted user code in a secure, isolated sandbox environment.
- **Real-time Status Polling:** After submission, the frontend polls the backend every second to get real-time status updates (e.g., "Pending," "In Progress," "Accepted," "Wrong Answer," "Time Limit Exceeded").
- **Modular Backend Architecture:** The backend is organized into a professional Service-Controller-Route pattern for scalability and maintainability.

---

## Local Development Setup

To run this project on your local machine, you will need two terminals.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend/myapp
    ```
2.  **Create the Environment File:**
    Create a file named `.env` and add the following variables. Replace the placeholders with your actual Supabase database details.
    ```env
    # Supabase Database Connection (use the POOLER URL components)
    DB_HOST=aws-1-ap-south-1.pooler.supabase.com
    DB_PORT=5432
    DB_USER=postgres.your_project_id
    DB_DATABASE=postgres
    DB_PASSWORD=your_supabase_password

    # Frontend URL for CORS
    CLIENT_ORIGIN_URL=http://localhost:5173
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Run Database Migrations:**
    This will create all the necessary tables (`problems`, `testcases`, `users`, etc.).
    ```bash
    npx knex migrate:latest
    ```
5.  **Start the Server:**
    ```bash
    node index.js
    ```
    The backend server will now be running on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend directory** in a **new terminal**:
    ```bash
    cd frontend
    ```
2.  **Create the Environment File:**
    Create a file named `.env` and add the following variable:
    ```env
    # Backend API URL for the frontend to use
    VITE_API_URL=http://localhost:3000
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The frontend React application will now be running on `http://localhost:5173`.

---
## API Endpoints

| Method | Path                  | Description                                        |
| :----- | :-------------------- | :------------------------------------------------- |
| `POST` | `/auth/register`      | Creates a new user account.                        |
| `POST` | `/auth/login`         | Logs in a user and returns a JSON Web Token (JWT). |
| `GET`  | `/problems`           | Fetches a list of all problems.                    |
| `GET`  | `/problems/:id`       | Fetches the full details for a single problem.     |
| `POST` | `/submit`             | Submits user code for execution (will be protected).|
| `GET`  | `/status/:id`         | Fetches the status of a specific submission.       |
| `POST` | `/add-problem`        | Adds a new problem to the database.                |
| `POST` | `/add-testcase`       | Adds a new testcase for a problem.                 |

---

## Planned Deployment Strategy

The application is designed for a decoupled deployment to cloud platforms.
- The **Frontend** (React app) is configured to be hosted on **Vercel**.
- The **Backend** (Node.js API) is configured to be hosted on **Render**.
