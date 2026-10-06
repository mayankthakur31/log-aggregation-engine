from backend.database import get_connection


def save_log(log):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO logs (
            timestamp,
            service,
            level,
            message,
            environment,
            request_id
        )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
        )
    """

    cursor.execute(
        query,
        (
            log["timestamp"],
            log["service"],
            log["level"],
            log["message"],
            log["environment"],
            log["request_id"]
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

def get_log_by_id(log_id):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT
            id,
            timestamp,
            service,
            level,
            message,
            environment,
            request_id
        FROM logs
        WHERE id = %s
    """

    cursor.execute(query, (log_id,))

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    return row

def get_log_stats():
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT
            COUNT(*) AS total_logs,
            COUNT(*) FILTER (WHERE level = 'ERROR') AS errors,
            COUNT(*) FILTER (WHERE level = 'WARNING') AS warnings,
            COUNT(*) FILTER (WHERE level = 'CRITICAL') AS critical,
            COUNT(*) FILTER (WHERE level = 'INFO') AS info
        FROM logs
    """

    cursor.execute(query)

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    return row


def get_logs(
    service=None,
    level=None,
    environment=None,
    search=None,
    limit=20,
    offset=0
):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT
            id,
            timestamp,
            service,
            level,
            message,
            environment,
            request_id
        FROM logs
        WHERE 1=1
    """

    params = []

    if service:
        query += " AND service = %s"
        params.append(service)

    if level:
        query += " AND level = %s"
        params.append(level)

    if environment:
        query += " AND environment = %s"
        params.append(environment)

    if search:
        query += " AND message ILIKE %s"
        params.append(f"%{search}%")

    query += " ORDER BY id DESC"

    query += " LIMIT %s OFFSET %s"
    params.append(limit)
    params.append(offset)

    cursor.execute(query, params)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    return rows