
GET_SYSTEM_CONFIG = """
    SELECT * FROM system_configuration
    WHERE ship_name = ? AND nomenclature = ?
"""

GET_COMPONENT_ID = """
    SELECT component_id
    FROM system_configuration
    WHERE ship_name = ?
    AND nomenclature = ?
"""

GET_PARENT_SHIP_ID = """
    SELECT component_id
    FROM system_configuration
    WHERE ship_name = ?
    AND nomenclature = ?
    AND parent_id IS NULL
"""

GET_NOMENCLATURE_BY_ID = """
    SELECT nomenclature
    FROM system_configuration
    WHERE component_id = ?
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

GET_ALPHA_BETA = """
    SELECT alpha, beta
    FROM alpha_beta
    WHERE component_id = ?
"""

GET_LATEST_RUNNING_AGE = """
    SELECT TOP 1
        maintenance_type,
        running_age
    FROM data_manager_overhaul_maint_data
    WHERE component_id = ?
    ORDER BY [date] DESC
"""

GET_OVERHAUL_INFO = """
    SELECT *
    FROM data_manager_overhauls_info
    WHERE component_id = ?
"""

GET_OVERHAUL_MAINT_DATA_ORDERED = """
    SELECT *
    FROM data_manager_overhaul_maint_data
    WHERE component_id = ?
    ORDER BY cmms_running_age
"""

GET_LAST_MAINT_DATE = """
    SELECT maint_date
    FROM data_manager_maintenance_data
    WHERE component_id = ?
    ORDER BY CAST(maint_date AS date) DESC
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
    AND CAST(operation_date AS date) > ?
"""


GET_MISSION_PROFILE = """
    SELECT *
    FROM mission_profile
    WHERE mission_name = ?
"""
