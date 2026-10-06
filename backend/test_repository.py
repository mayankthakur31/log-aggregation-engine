from backend.log_repository import save_log
from backend.database import get_connection
from datetime import datetime, timezone


connection = get_connection()

print("Connected to database:", connection.info.dbname)
print("Connected as user:", connection.info.user)
print("Connected to host:", connection.info.host)
print("Connected to port:", connection.info.port)

connection.close()


test_log = {
    "timestamp": datetime.now(timezone.utc),
    "service": "test-service",
    "level": "INFO",
    "message": "Log saved from Python",
    "environment": "development",
    "request_id": "req-python-001"
}

save_log(test_log)

print("Log saved successfully!")