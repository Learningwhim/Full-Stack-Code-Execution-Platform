Full Stack Real-Time Code Execution & Contest Platform
This is a comprehensive, high-stakes project that demonstrates expertise across the entire full-stack architecture, deployment, and security pipeline.

🎯 Key Accomplishments
Real-Time Architecture: Architected and implemented a Hybrid Architecture using WebSockets (Socket.IO) to manage live state. Successfully implemented instantaneous leaderboard updates across all connected clients for multi-problem coding contests.

Security & Authentication: Designed and deployed a robust, token-based authentication system utilizing bcrypt for irreversible password hashing and JSON Web Tokens (JWT) for session management and route protection via custom middleware.

Data Integrity & Design: Managed complex relational data in PostgreSQL (Knex.js), designing a Many-to-Many schema for linking rooms to problems. Ensured ACID compliance during resource creation by implementing database transactions with Promise.all.

Containerized Execution: Engineered a secure execution environment using Docker to compile and run untrusted user-submitted C++ code within isolated, resource-limited sandboxes, verifying security standards and mitigating potential exploits.

System Architecture: Refactored the initial codebase into a scalable Service-Controller-Route (S-C-R) pattern, improving modularity and maintainability while establishing a clean separation between database and business logic.

Frontend UX: Developed a dynamic React.js interface featuring state-driven problem navigation, real-time status polling, and conditional rendering based on user authentication status.
