import random
import time
import uuid
import requests
from datetime import datetime, timezone


LOG_COLLECTOR_URL = "http://127.0.0.1:8000/logs"


def generate_user_log():
    log_levels = ["INFO", "INFO", "INFO", "WARNING", "ERROR"]

    level = random.choice(log_levels)

    messages = {
        "INFO": [
            "User login successful",
            "User profile fetched",
            "User registration completed"
        ],
        "WARNING": [
            "User login attempt took longer than expected"
        ],
        "ERROR": [
            "User authentication failed",
            "User service unavailable"
        ]
    }

    message = random.choice(messages[level])

    log = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "user-service",
        "level": level,
        "message": message,
        "environment": "development",
        "request_id": str(uuid.uuid4())
    }

    return log


def send_log(log):
    try:
        response = requests.post(
            LOG_COLLECTOR_URL,
            json=log,
            timeout=5
        )

        print(
            f"Log sent | "
            f"status={response.status_code} | "
            f"log={log}"
        )

    except requests.RequestException as error:
        print(f"Failed to send log: {error}")


if __name__ == "__main__":
    while True:
        log = generate_user_log()

        send_log(log)

        time.sleep(2)