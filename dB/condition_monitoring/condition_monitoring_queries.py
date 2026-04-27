FETCH_SENSOR_BASED_DATA = """
    SELECT component_id, equipment_id, failure_mode_id, name, min_value, max_value, unit
    FROM sensor_based_data
    WHERE equipment_id = ?
"""

FETCH_PARAMETER_DATA = """
    SELECT component_id, name, date, value, operating_hours
    FROM parameter_data
    WHERE component_id = ?
"""

FETCH_GRAPH_DATA = """
    SELECT
        pc.component_name, pc.nomenclature,
        p.name, p.value, p.date,
        s.equipment_id, p.operating_hours, s.min_value, s.max_value, s.failure_mode_id, s.unit
    FROM parameter_data p
    JOIN sensor_based_data s ON p.parameter_id = s.id
    JOIN system_configuration pc ON p.component_id = pc.component_id
    WHERE pc.component_id = ?
"""
INSERT_SENSOR_BASED_DATA = """
    INSERT INTO sensor_based_data
        (id, component_id, equipment_id, name, failure_mode_id, frequency, unit,
        min_value, max_value, P, F)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

INSERT_SENSOR_PARAMETER_ATTRIBUTES = """
    INSERT INTO sensor_parameter_attributes (id, parameter_id, level, threshold)
    VALUES (?, ?, ?, ?)
"""

INSERT_SENSOR_ALARM_DATA = """
    INSERT INTO sensor_alarm_data (id, alarm)
    VALUES (?, ?)
"""

INSERT_SENSOR_ALARM_ATTRIBUTES = """
    INSERT INTO sensor_alarm_attributes (id, alarm_id, parameter_id, level_id)
    VALUES (?, ?, ?, ?)
"""

INSERT_PARAMETER_DATA = """
    INSERT INTO parameter_data (id, component_id, parameter_id, name, value, date, operating_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?)
"""

FETCH_SENSOR_BY_COMPONENT = """
    SELECT * FROM sensor_based_data WHERE component_id = ?
"""

FETCH_ALL_SENSORS_WITH_CONFIG = """
    SELECT sbd.name, sbd.equipment_id, sbd.id, sbd.max_value, sbd.min_value,
           sc.component_name, sc.nomenclature
    FROM sensor_based_data sbd
    JOIN system_configuration sc ON sbd.equipment_id = sc.component_id
    WHERE sbd.name <> ''
"""

FETCH_PARAM_ID_BY_COMPONENT_AND_NAME = """
    SELECT id FROM sensor_based_data WHERE component_id = ? AND name = ?
"""

FETCH_CM_DATA = """
    SELECT id, T1.component_id, equipment_id, name AS parameter_name,
           T2.component_name AS equipment_name,
           T3.component_name AS component_name
    FROM sensor_based_data AS T1
    JOIN system_configuration AS T2 ON T1.equipment_id = T2.component_id
    JOIN system_configuration AS T3 ON T3.component_id = T1.component_id
    WHERE equipment_id = ? AND name = ?
"""

FETCH_PARAMETER_DATA_BY_PARAM_ID = """
    SELECT date, value FROM parameter_data WHERE parameter_id = ?
"""

FETCH_SENSOR_PARAM_ATTRIBUTES_BY_PARAM_ID = """
    SELECT level, threshold FROM sensor_parameter_attributes WHERE parameter_id = ?
"""

FETCH_DISPLAY_DATA = """
    SELECT T1.id, T2.id AS attr_id, failure_mode_id, name, min_value, max_value, unit,
           T2.parameter_id, level, threshold
    FROM (
        SELECT id, failure_mode_id, name, min_value, max_value, unit
        FROM sensor_based_data
        WHERE component_id = ?
    ) AS T1
    JOIN sensor_parameter_attributes AS T2 ON T1.id = T2.parameter_id
"""

UPDATE_SENSOR_BASED_DATA = """
    UPDATE sensor_based_data
    SET failure_mode_id = ?, name = ?, min_value = ?, max_value = ?, unit = ?
    WHERE id = ?
"""

UPDATE_SENSOR_PARAMETER_ATTRIBUTES = """
    UPDATE sensor_parameter_attributes
    SET level = ?, threshold = ?
    WHERE id = ?
"""