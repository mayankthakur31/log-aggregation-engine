from backend.log_repository import get_logs


logs = get_logs()

for log in logs:
    print(log)