from queue import Queue


log_queue = Queue()


def producer():
    for number in range(1, 6):
        log = f"log-{number}"

        print(f"Producer → adding {log}")

        log_queue.put(log)


def consumer():
    while not log_queue.empty():
        log = log_queue.get()

        print(f"Consumer ← processing {log}")

        log_queue.task_done()


producer()
consumer()