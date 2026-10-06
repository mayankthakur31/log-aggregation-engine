from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from threading import Thread
from typing import Optional

from backend.queue_manager import log_queue
from backend.worker import start_worker
from backend.log_repository import (
    get_logs,
    get_log_by_id,
    get_log_stats
)

app = FastAPI(
    title="Distributed Log Aggregation & Real-Time Alerting Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class LogEntry(BaseModel):
    timestamp: str
    service: str
    level: str
    message: str
    environment: str
    request_id: str


@app.on_event("startup")
def start_background_worker():
    worker_thread = Thread(
        target=start_worker,
        daemon=True
    )

    worker_thread.start()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "log-aggregator"
    }


@app.get("/logs")
def fetch_logs(
    service: Optional[str] = None,
    level: Optional[str] = None,
    environment: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    rows = get_logs(
        service=service,
        level=level,
        environment=environment,
        search=search,
        limit=limit,
        offset=offset
    )

    logs = []

    for row in rows:
        logs.append({
            "id": row[0],
            "timestamp": row[1],
            "service": row[2],
            "level": row[3],
            "message": row[4],
            "environment": row[5],
            "request_id": row[6]
        })

    return {
        "count": len(logs),
        "limit": limit,
        "offset": offset,
        "logs": logs
    }
@app.get("/logs/{log_id}")
def fetch_log_by_id(log_id: int):

    row = get_log_by_id(log_id)

    if row is None:
        return {
            "error": "Log not found"
        }

    return {
        "id": row[0],
        "timestamp": row[1],
        "service": row[2],
        "level": row[3],
        "message": row[4],
        "environment": row[5],
        "request_id": row[6]
    }

@app.post("/logs")
def receive_log(log: LogEntry):
    log_queue.put(log.model_dump())

    print(
        f"Log added to queue | "
        f"service={log.service} | "
        f"level={log.level}"
    )

    return {
        "status": "queued"
    }

@app.get("/stats")
def fetch_stats():

    row = get_log_stats()

    return {
        "total_logs": row[0],
        "errors": row[1],
        "warnings": row[2],
        "critical": row[3],
        "info": row[4]
    }