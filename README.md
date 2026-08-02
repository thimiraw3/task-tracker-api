# Task Tracker API

A REST API for managing tasks, built to demonstrate a full containerized CI/CD workflow: Node.js/Express + PostgreSQL, Dockerized with multi-stage builds, and deployed via a GitHub Actions pipeline that tests, builds, and publishes to GitHub Container Registry on every merge to `main`.

## Features
- CRUD API for tasks (`GET`, `POST`, `PUT`, `DELETE /tasks`)
- Health check endpoint (`/health`) for readiness/liveness monitoring
- PostgreSQL persistence
- Multi-stage Dockerfile with a non-root runtime user
- Docker Compose for one-command local development
- CI/CD: automated tests gate image builds; images are tagged with both `latest` and the commit SHA for traceability

## Tech stack
Node.js, Express, PostgreSQL, Docker, Docker Compose, GitHub Actions, GHCR

## Running locally
```bash
git clone https://github.com/<you>/task-tracker-api.git
cd task-tracker-api
docker compose up --build
```
API available at `http://localhost:3000`.

## API Reference
| Method | Endpoint      | Description       |
|--------|---------------|--------------------|
| GET    | /health       | Health check       |
| GET    | /tasks        | List all tasks     |
| GET    | /tasks/:id    | Get a single task  |
| POST   | /tasks        | Create a task      |
| PUT    | /tasks/:id    | Update a task      |
| DELETE | /tasks/:id    | Delete a task      |

## CI/CD Pipeline
Every PR runs the test suite. On merge to `main`, a passing build is packaged into a Docker image and published to GHCR, tagged `latest` and with the commit SHA.

## Architecture decisions
- **Multi-stage Docker build** keeps the runtime image lean and free of build-time dependencies.
- **Non-root container user** reduces the blast radius of a potential container breakout.
- **DB layer mocked in unit tests** so the test suite runs fast and has no external dependency; a future addition would be an integration test stage against a real Postgres instance in CI.

## Kubernetes Deployment

Manifests in `k8s/` deploy the full stack to any Kubernetes cluster (tested on Minikube):
- Postgres: Deployment + Service + PersistentVolumeClaim + Secret
- API: Deployment (2 replicas) + Service + ConfigMap, with readiness/liveness probes on `/health`
- Ingress (nginx) for external routing

### Deploy
```bash
kubectl apply -f k8s/
```
