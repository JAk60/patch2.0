FETCH_USER_SELECTION = """
    SELECT * FROM user_selection
"""

FETCH_SYSTEM_CONFIGURATION = """
    SELECT ship_name, ship_category, ship_class, command, department,
           component_name, nomenclature
    FROM system_configuration
    WHERE parent_id IS NULL
"""

FETCH_UNIQUE_SYSTEM_IDS = """
    SELECT DISTINCT ship_name, component_id, component_name, nomenclature
    FROM system_configuration
    WHERE parent_id IS NULL
"""

FETCH_CMMS_SELECTION = """
    SELECT
        EquipmentName AS component_name,
        M_Equipment.EquipmentCode AS CMMS_EquipmentCode,
        ShipName AS ship_name,
        M_ShipCategory.ShipCategoryName AS ship_category,
        M_ShipClass.Description AS ship_class,
        CommandName AS command,
        M_Department.Description AS department,
        Nomenclature AS nomenclature
    FROM
        T_EquipmentShipDetail WITH(NOLOCK)
        INNER JOIN M_Equipment WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Equipment = M_Equipment.Universal_ID_M_Equipment
        INNER JOIN M_Ship WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
        INNER JOIN M_ShipClass WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipClass = M_ShipClass.Universal_ID_M_ShipClass
        INNER JOIN M_ShipCategory WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipCategory = M_ShipCategory.Universal_ID_M_ShipCategory
        INNER JOIN M_Command WITH(NOLOCK) ON M_Ship.Universal_ID_M_Command = M_Command.Universal_ID_M_Command
        INNER JOIN M_Department WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Department = M_Department.Universal_ID_M_Department
    WHERE
        T_EquipmentShipDetail.Active = 1
        AND RemovalDate IS NULL
        AND M_Ship.Active = 1
        AND M_Ship.DecommissionDate IS NULL
        AND M_ShipClass.Active = 1
"""