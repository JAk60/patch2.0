from flask import request, jsonify
from dB.dB_utility import cursor, cnxn


def add_user_selection_data(data):
    print(data["values"])
    data = data["values"]
    command = data["command"]
    ship_name = data["ship_name"]
    department = data["department"]
    ship_class = data["shipClass"]
    ship_category = data["shipC"]

    merge_sql = '''
        MERGE INTO user_selection AS target
        USING (VALUES (?, ?, ?, ?, ?)) AS source(ship_name, ship_category, ship_class, command, department)
        ON target.ship_name = source.ship_name
        AND target.department = source.department
        WHEN NOT MATCHED THEN
            INSERT (ship_name, ship_category, ship_class, command, department)
            VALUES (?, ?, ?, ?, ?);
    '''

    cursor.execute(merge_sql, (ship_name, ship_category, ship_class, command, department,
                            ship_name, ship_category, ship_class, command, department))

    
    # Check if any rows were affected by the merge operation
    if cursor.rowcount > 0:
        cnxn.commit()
        return jsonify({"code": 1, "message": "Data inserted or updated successfully."})
    else:
        return jsonify({"code": 0, "message": "Matching record found. Data not inserted."})
