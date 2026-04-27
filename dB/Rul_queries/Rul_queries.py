FETCH_PF_VALUES = """
    SELECT P, F
    FROM sensor_based_data
    WHERE name = ? AND component_id = ?
"""

FETCH_PF_BY_COMPONENT_AND_PARAM = """
    SELECT P, F FROM sensor_based_data WHERE component_id = ? AND name = ?
"""

FETCH_OPERATING_HOURS_AND_VALUE = """
    SELECT operating_hours, value
    FROM parameter_data
    WHERE name = ? AND component_id = ?
"""

FETCH_SENSORS_BY_COMPONENT = """
    SELECT id, name, P, F FROM sensor_based_data WHERE component_id = ?
"""

FETCH_SENSOR_NAMES_BY_COMPONENT = """
    SELECT name FROM sensor_based_data WHERE component_id = ?
"""