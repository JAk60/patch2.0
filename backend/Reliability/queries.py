
GET_COMPONENT_ID = """
    SELECT component_id
    FROM system_configuration
    WHERE ship_name = ? COLLATE SQL_Latin1_General_CP1_CS_AS
    AND nomenclature = ? COLLATE SQL_Latin1_General_CP1_CS_AS;
"""

GET_SYSTEM_CONFIGURATION = """
    SELECT * FROM system_configuration
    WHERE ship_name = ? AND nomenclature = ?
"""

GET_SHIP_AND_NOMENCLATURE = """
    SELECT ship_name, nomenclature
    FROM system_configuration
    WHERE component_id = ?
"""

GET_OVERHAUL_INFO = """
    SELECT * FROM data_manager_overhauls_info
    WHERE component_id = ?
"""

GET_OVERHAUL_MAINT_DATA = """
    SELECT * FROM data_manager_overhaul_maint_data
    WHERE component_id = ?
    ORDER BY date ASC
"""

GET_LATEST_RUNNING_AGE = """
    SELECT TOP 1 maintenance_type, running_age
    FROM data_manager_overhaul_maint_data
    WHERE component_id = ?
    ORDER BY date DESC
"""

DELETE_OVERHAUL_MAINT_DATA = """
    DELETE FROM data_manager_overhaul_maint_data
    WHERE component_id = ?
"""

INSERT_OVERHAUL_MAINT_DATA = """
    INSERT INTO data_manager_overhaul_maint_data (
        id, component_id, overhaul_id, date,
        maintenance_type, running_age,
        associated_sub_system, cmms_running_age
    )
    VALUES (?,?,?,?,?,?,?,?)
"""


GET_TOP5_AVG_RUNNING = """
    SELECT AVG(average_running)
    FROM (
        SELECT TOP 5 average_running
        FROM operational_data
        WHERE component_id = ?
        AND operation_date <= ?
        AND average_running > 0
        ORDER BY operation_date DESC
    ) AS TopFive;
"""

GET_CUMULATIVE_RUNNING = """
    SELECT SUM(average_running)
    FROM operational_data
    WHERE operation_date <= ?
    AND component_id = ?
"""

GET_AVG_RUNNING = """
    SELECT AVG(average_running)
    FROM operational_data
    WHERE component_id = ?
"""

GET_AVG_RUNNING_AFTER_DATE = """
    SELECT AVG(average_running)
    FROM operational_data
    WHERE component_id = ?
    AND CAST(operation_date as date) > ?
"""


GET_ALPHA_BETA = """
    SELECT alpha, beta
    FROM alpha_beta
    WHERE component_id = ?
"""

MERGE_ALPHA_BETA = """
    MERGE INTO alpha_beta AS target
    USING (VALUES (?, ?, ?, ?)) AS source (id, component_id, alpha, beta)
    ON target.component_id = source.component_id
    WHEN MATCHED THEN
        UPDATE SET alpha = source.alpha, beta = source.beta
    WHEN NOT MATCHED THEN
        INSERT (id, component_id, alpha, beta)
        VALUES (source.id, source.component_id, source.alpha, source.beta);
"""

GET_ALPHA_BETA_JOIN = """
    SELECT *
    FROM alpha_beta
    INNER JOIN system_configuration sc
    ON alpha_beta.component_id = sc.component_id
    WHERE sc.nomenclature = ?
    AND sc.ship_name = ?
"""

GET_ETA_BETA_JOIN = """
    SELECT *
    FROM eta_beta
    INNER JOIN system_configuration sc
    ON eta_beta.component_id = sc.component_id
    WHERE sc.nomenclature = ?
    AND sc.ship_name = ?
"""

GET_MISSION_PROFILE = """
    SELECT *
    FROM mission_profile
    WHERE mission_name = ?
"""
