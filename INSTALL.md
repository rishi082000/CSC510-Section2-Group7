# PackEats Installation Guide

PackEats is a secure and efficient food delivery platform designed for NC State’s campus community.  
It connects students and local residents to on-campus restaurants, providing fast, reliable, and affordable food delivery.

This document explains how to **set up**, **run**, and **test** both the frontend and backend of the PackEats project.

---

## 🧩 Prerequisites

Before installing and running PackEats, make sure you have the following tools installed:

| Tool | Purpose |
|------|----------|
| **Node.js (LTS)** and **npm/yarn** | Required for the frontend and any Node-based backend |
| **Java 17+** and **Maven/Gradle** | Required for the Java Spring Boot backend |
| **Git** | To clone the repository |
| **Modern Browser** | To view the frontend UI (Chrome, Edge, Firefox, etc.) |

---

## 📦 1. Clone the Repository

Clone the repository from GitHub and move into the project directory:

```bash
git clone https://github.com/rishi082000/CSC510-Section2-Group7.git
cd CSC510-Section2-Group7

## Running the frontend

A. Static frontend (no package.json)
1. Open `proj2/frontend/pack-eats/index.html` directly in your browser, OR
2. Start it locally:
   ```bash
   # from repo root
   cd proj2/frontend/pack-eats
   # Using a simple static server (if installed):
   npx start .         
   ```
3. Visit http://localhost:3000 (or the port used).

B. Node-based frontend (package.json present)
1. Install and run:
   ```bash
   cd proj2/frontend/pack-eats
   npm install
   npm start            # or: npm run dev / npm run serve depending on package.json scripts
   ```
2. Make sure to install the version 6 of react-router-dom. This is because we are currently trying to mock react-router-dom for running the jest unit test cases. This can be done by the following:
   ```
   npm install react-router-dom@6
   ``` 
4. Visit the port printed by the start command (commonly `http://localhost:3000`).

If the frontend requires environment variables, create a `.env` in `proj2/frontend/pack-eats` as described in the relevant package.json or README.

---

## Running the backend

A. Java backend (Maven/Gradle)
1. Maven (pom.xml present):
   ```bash
   cd proj2/backend/pack-eats
   ./mvnw spring-boot:run   # if mvnw is present
   # or
   mvn spring-boot:run
   ```
2. The app commonly starts on `http://localhost:8080` — check console output for the exact port.

B. Node.js backend (package.json present)
1. Install and run:
   ```bash
   cd proj2/backend/pack-eats
   npm install
   npm start               # or the script specified (npm run dev)
   ```
2. Check console for the port (often `http://localhost:3000` or `http://localhost:8080`).

## Connecting frontend and backend

- Confirm backend API base URL and port (e.g., `http://localhost:8080/api`).
- If the frontend expects an API base URL in an env var (e.g., REACT_APP_API_URL), set that before starting the frontend:
  ```bash
  export REACT_APP_API_URL=http://localhost:8080
  npm start
  ```
- The above step is optional and can be skipped because we have hardcoded to post and get from localhost:8080 server.
- If you encounter CORS errors, enable CORS on the backend or use a proxy in the frontend dev server (check frontend config like `proxy` in package.json or webpack/vite dev settings).

---

## Tests

- Node: `npm test` in frontend or backend where relevant.
- Java: `mvn test` in `proj2/backend/pack-eats`.

---
