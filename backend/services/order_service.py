import random
import time
import uuid
import requests
from datetime import datetime


LOG_COLLECTOR_URL = "http://127.0.0.1:8000/logs"


def generate_order_log():
    log_levels = ["INFO", "INFO", "INFO", "WARNING", "ERROR"]

    level = random.choice(log_levels)

    messages = {
        "INFO": [
            "Order created",
            "Order updated",
            "Order shipped",
            "Order delivered"
        ],
        "WARNING": [
            "Order processing is delayed"
        ],
        "ERROR": [
            "Order creation failed",
            "Order database operation failed"
        ]
    }

    message = random.choice(messages[level])

    log = {
        "timestamp": datetime.utcnow().isoformat(),
        "service": "order-service",
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
        log = generate_order_log()

        send_log(log)

        time.sleep(4)