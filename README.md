
# PackEats

PackEats is a secure and efficient food delivery platform designed for NC State’s campus community. It connects students and local residents to on-campus restaurants, ensuring quick, reliable, and affordable service. A personalized quiz helps users discover dishes that match their tastes and personalities. The platform also supports eco-drivers—students delivering via bikes or public transport—to promote sustainability and inclusivity. By blending personalization, green delivery, and optimized logistics, PackEats streamlines campus dining while providing job opportunities for students.

---

# Team Members

| # | Name                               | UnityID  |
|---:|------------------------------------|----------|
| 1 | Rishabh Ravi Kumar                  | rishabh  |
| 2 | Rishi Senthil Kumar                 | rsenthi  |
| 3 | Jagadeshwar Muthukumaran            | jmuthuk  |
| 4 | Krisha Sanjaykumar Darji            | kdarji   |
| 5 | Priyal Brijesh Doctor               | pdoctor  |

---

# What PackEats delivers
- Fast, dependable deliveries from on‑campus food providers.
- Personalized meal recommendations via a short quiz that matches dishes to users’ tastes and preferences.
- Sustainable delivery choices through “eco-driver” options: students who use bicycles or public transit can deliver for lower fees with slightly longer delivery windows.
- Scalable tools for campus administrators and vendors to manage menus, orders, and reporting.

---

# Core features (user-facing)
- Personalized quiz and recommendations to help users decide what to order.
- Menu browsing, favorites, and simple order placement.
- Delivery selection including standard drivers and eco-drivers.
- Order tracking and status updates for users, drivers, and vendors.

---

## How the project is organized (where to find the code)
- proj2/frontend/pack-eats — The user interface and client-side logic: pages for browsing menus, taking the personalization quiz, placing orders, and tracking status.
- proj2/backend/pack-eats — Server-side services and APIs: user and vendor management, order processing, driver assignment and tracking, and admin endpoints.
- Look inside each folder for build files (package.json, pom.xml/gradle files) and README or .env.example files that describe exact run steps.

---

## Prerequisites

Install the tools required for whichever stack you detect:
- Node.js (LTS) and npm or yarn — for Node frontends/backends
- Java 17+ (or project JDK version) and Maven/Gradle — for Java backends
- Optional: Docker (if containerized)
- A modern browser for the frontend

---

## Running the frontend

A. Static frontend (no package.json)
1. Open `proj2/frontend/pack-eats/index.html` directly in your browser, OR
2. Serve it locally:
   ```bash
   # from repo root
   cd proj2/frontend/pack-eats
   # Using a simple static server (if installed):
   npx serve .          # or: python3 -m http.server 8080
   ```
3. Visit http://localhost:8080 (or the port used).

B. Node-based frontend (package.json present)
1. Install and run:
   ```bash
   cd proj2/frontend/pack-eats
   npm install
   npm start            # or: npm run dev / npm run serve depending on package.json scripts
   ```
2. Visit the port printed by the start command (commonly `http://localhost:3000` or `http://localhost:5173`).

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
2. Gradle (build.gradle):
   ```bash
   cd proj2/backend/pack-eats
   ./gradlew bootRun
   # or
   gradle bootRun
   ```
3. The app commonly starts on `http://localhost:8080` — check console output for the exact port.

B. Node.js backend (package.json present)
1. Install and run:
   ```bash
   cd proj2/backend/pack-eats
   npm install
   npm start               # or the script specified (npm run dev)
   ```
2. Check console for the port (often `http://localhost:3000` or `http://localhost:8080`).

C. If a Dockerfile or docker-compose.yml exists:
1. Build and run with Docker:
   ```bash
   # from repo root
   docker build -t proj2-backend proj2/backend/pack-eats
   docker run -p 8080:8080 proj2-backend
   ```
   or use `docker-compose up --build` if a compose file is provided.

---

## Connecting frontend and backend

- Confirm backend API base URL and port (e.g., `http://localhost:8080/api`).
- If the frontend expects an API base URL in an env var (e.g., REACT_APP_API_URL), set that before starting the frontend:
  ```bash
  export REACT_APP_API_URL=http://localhost:8080
  npm start
  ```
- If you encounter CORS errors, enable CORS on the backend or use a proxy in the frontend dev server (check frontend config like `proxy` in package.json or webpack/vite dev settings).

---

## Tests

- Node: `npm test` in frontend or backend where relevant.
- Java: `mvn test` or `./gradlew test` in `proj2/backend/pack-eats`.

---

## Build for production

- Frontend: `npm run build` (if available) produces static assets in a `build` or `dist` folder.
- Backend: create an executable jar:
  - Maven: `mvn package` → run `java -jar target/<artifact>.jar`
  - Gradle: `./gradlew build` → run `java -jar build/libs/<artifact>.jar`

---

## Common issues & troubleshooting

- Missing dependencies: run `npm install` or `mvn dependency:resolve`.
- Port conflicts: change ports in application config or use env variables.
- Environment variables: check README files inside frontend/backend or look for `.env.example`.

---

## DOI badges

CodeChecker: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17546110.svg)](https://doi.org/10.5281/zenodo.17546110)

CodeFormatter: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17546157.svg)](https://doi.org/10.5281/zenodo.17546157)

Coverage: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17546170.svg)](https://doi.org/10.5281/zenodo.17546170)

StyleChecker: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17546175.svg)](https://doi.org/10.5281/zenodo.17546175)

SyntaxChecker: [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17546181.svg)](https://doi.org/10.5281/zenodo.17546181)

---

# PackEats — Configuration files by tool

The PackEats code is organized under:
  - proj2/frontend/pack-eats
  - proj2/backend/pack-eats

Run these commands from the repository root to discover the real config files and their exact paths:
```bash
# show top-level and proj2 entries
ls -la
ls -la proj2
# show pack-eats folders
ls -la proj2/frontend/pack-eats || true
ls -la proj2/backend/pack-eats || true

# find common config files across proj2
find proj2 -maxdepth 4 -type f \( -name 'package.json' -o -name 'package-lock.json' -o -name 'yarn.lock' -o -name 'pom.xml' -o -name 'build.gradle' -o -name 'gradlew' -o -name 'mvnw' -o -name 'Dockerfile' -o -name 'docker-compose.yml' -o -name '.env' -o -name '.env.example' -o -name '*.yml' -o -name '.eslintrc*' -o -name '.prettierrc*' -o -name 'tsconfig.json' -o -name 'jest.config.js' \) -print
```

Node.js / JavaScript (frontend or Node backend)
- package.json — project scripts and dependencies  
  Typical locations:
  - proj2/frontend/pack-eats/package.json
  - proj2/backend/pack-eats/package.json (if backend uses Node)
- package-lock.json or yarn.lock — exact dependency versions
- .env or .env.example — environment variables for local dev
- .npmrc, .nvmrc — Node/npm configuration and Node version
- tsconfig.json — TypeScript settings (if used)
- jest.config.js, vitest config — test runner config
- .eslintrc.*, .prettierrc.*, .editorconfig — linters and formatters

Java (Maven / Gradle backend)
- pom.xml — Maven project definition (common for Spring Boot)
- mvnw, .mvn/ — Maven wrapper and config
- build.gradle, settings.gradle, gradlew — Gradle build and wrapper files
- application.properties or application.yml — Spring Boot configuration (often under src/main/resources)
- gradle.properties — Gradle properties file

Docker & containerization
- Dockerfile — image build instructions
  Possible locations:
  - proj2/frontend/pack-eats/Dockerfile
  - proj2/backend/pack-eats/Dockerfile
  - root Dockerfile
- docker-compose.yml — multi-service local setup (root or proj2 folder)

CI / GitHub Actions
- .github/workflows/*.yml — CI workflows (e.g., build, test, lint, publish)
  Check:
  - .github/workflows/

Static site / web server configs
- netlify.toml, vercel.json — hosting platform settings (if used)
- nginx.conf — reverse-proxy or static-server configuration

Linters, formatters, editor
- .eslintrc.js / .eslintrc.json
- .prettierrc / .prettierrc.json
- .editorconfig
- .vscode/* — recommended VS Code settings and launch configurations

Other useful files
- README.md or docs/ — per-module instructions
- .gitignore — ignored files and folders
- LICENSE — project license (if present)

Example quick mapping (replace with real paths after running the find command)
- Frontend
  - proj2/frontend/pack-eats/package.json
  - proj2/frontend/pack-eats/.env.example
  - proj2/frontend/pack-eats/Dockerfile
- Backend (Java)
  - proj2/backend/pack-eats/pom.xml
  - proj2/backend/pack-eats/mvnw
  - proj2/backend/pack-eats/src/main/resources/application.yml
- Backend (Node)
  - proj2/backend/pack-eats/package.json
  - proj2/backend/pack-eats/.env.example
  - proj2/backend/pack-eats/Dockerfile

---
## Discussion Forum

Discord group chat: https://discordapp.com/channels/1407018980891431053/1408899754078900254 

----

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---
