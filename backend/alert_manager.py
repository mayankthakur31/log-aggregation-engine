from time import time


error_times = {}
last_alert_time = {}


ERROR_THRESHOLD = 5
ERROR_WINDOW = 60
ALERT_COOLDOWN = 60


def check_for_alert(log):

    level = log["level"]
    service = log["service"]

    # -------------------------
    # CRITICAL ALERT
    # -------------------------
    if level == "CRITICAL":

        print(
            f"🚨 CRITICAL ALERT | "
            f"service={service} | "
            f"message={log['message']}"
        )

        return

    # -------------------------
    # WARNING ALERT
    # -------------------------
    if level == "WARNING":

        print(
            f"⚠️ WARNING | "
            f"service={service} | "
            f"message={log['message']}"
        )

        return

    # -------------------------
    # ERROR MONITORING
    # -------------------------
    if level != "ERROR":
        return

    current_time = time()

    if service not in error_times:
        error_times[service] = []

    error_times[service].append(current_time)

    # Keep only errors from last 60 seconds
    error_times[service] = [
        timestamp
        for timestamp in error_times[service]
        if current_time - timestamp <= ERROR_WINDOW
    ]

    error_count = len(error_times[service])

    print(
        f"🚨 ALERT | "
        f"service={service} | "
        f"message={log['message']} | "
        f"errors_in_last_60s={error_count}"
    )

    # High error rate
    if error_count >= ERROR_THRESHOLD:

        previous_alert = last_alert_time.get(service)

        if (
            previous_alert is None
            or current_time - previous_alert >= ALERT_COOLDOWN
        ):

            print(
                f"🔥 HIGH ERROR RATE | "
                f"service={service} | "
                f"errors={error_count} "
                f"in the last {ERROR_WINDOW} seconds"
            )

            last_alert_time[service] = current_time