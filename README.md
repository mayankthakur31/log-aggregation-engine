# Distributed Log Aggregation & Real-Time Alerting Engine

A full-stack log monitoring system built with FastAPI, PostgreSQL, and React. It collects application logs, processes them asynchronously, stores them in a database, and provides a dashboard to monitor and search logs.

## 🚀 Features

- **Log Ingestion:** Accept logs through a REST API.
- **Queue-Based Processing:** Process logs asynchronously using a queue and background worker.
- **PostgreSQL Storage:** Persist application logs in a relational database.
- **Real-Time Alerting:** Detect configured warning, critical, and error conditions.
- **Log Filtering:** Filter logs by service, severity level, and environment.
- **Search & Pagination:** Search log messages and navigate through paginated results.
- **Monitoring Dashboard:** View logs through a React-based web interface.
- **Auto-Refresh:** Automatically refresh dashboard data every 10 seconds.
- **REST API:** Retrieve logs, individual log entries, and statistics.

## 🛠️ Tech Stack

**Backend**
- Python
- FastAPI
- PostgreSQL
- Psycopg
- Python Queue and background worker

**Frontend**
- React
- JavaScript
- Vite
- Tailwind CSS

## 🏗️ Architecture

```text
Application Services
        |
        v
    POST /logs
        |
        v
       Queue
        |
        v
 Background Worker
        |
        v
   Alert Manager
        |
        v
    PostgreSQL
        |
        v
 GET /logs and /stats
        |
        v
 Filtering, Search
    & Pagination
        |
        v
  React Dashboard
```

## ⚙️ Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/mayankthakur31/log-aggregation-engine.git
cd log-aggregation-engine
```

### 2. Configure the database

Create a PostgreSQL database named `log_aggregator`.

Configure your database connection settings using environment variables expected by the backend. Keep your actual credentials in a local `.env` file and never commit secrets to GitHub.

Ensure the required database tables are created before running the application.

### 3. Start the backend

From the project root, create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies required by the project, then run:

```bash
uvicorn backend.main:app --reload
```

Backend: `http://127.0.0.1:8000`

Interactive API documentation: `http://127.0.0.1:8000/docs`

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check backend health |
| POST | `/logs` | Submit a log entry |
| GET | `/logs` | Retrieve, filter, search, and paginate logs |
| GET | `/logs/{log_id}` | Retrieve a specific log |
| GET | `/stats` | Retrieve log statistics |

See `/docs` for request parameters and response schemas.

## 🎯 Learning Outcomes

This project demonstrates practical experience with REST API development, asynchronous processing, queue-based architecture, relational database integration, log filtering, pagination, and frontend-backend integration.

## 🔮 Future Improvements

- Redis Streams for distributed log processing
- Docker-based deployment
- Authentication and role-based access control
- Centralized deployment and monitoring
- Configurable alert delivery channels

## 👨‍💻 Author

**Mayank Dod**

GitHub: [@mayankthakur31](https://github.com/mayankthakur31)

---

*Built as a hands-on project to explore backend engineering, database systems, and full-stack development.*
