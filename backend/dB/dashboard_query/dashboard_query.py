FETCH_USERS_BY_LEVEL = """
    SELECT * FROM users WHERE level = ?
"""

UPDATE_USER_PASSWORD = """
    UPDATE users
    SET password = ?
    WHERE user_id = ?
"""

DELETE_USER_BY_ID = """
    DELETE FROM users WHERE user_id = ?
"""

COUNT_USERS = """
    SELECT COUNT(*) FROM users
"""

COUNT_EQUIPMENTS = """
    SELECT COUNT(nomenclature) FROM system_configuration
"""

COUNT_DISTINCT_SHIPS = """
    SELECT COUNT(DISTINCT ship_name) FROM system_configuration
"""