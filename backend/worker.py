from backend.queue_manager import log_queue
from backend.log_repository import save_log
from backend.alert_manager import check_for_alert


def process_log(log):
    print(
        f"Worker processing | "
        f"service={log['service']} | "
        f"level={log['level']} | "
        f"message={log['message']}"
    )

    save_log(log)

    check_for_alert(log)


def start_worker():
    print("Worker started...")

    while True:
        log = log_queue.get()

        process_log(log)

        log_queue.task_done()