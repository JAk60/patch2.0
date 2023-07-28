from dB.dB_connection import cursor, cnxn


def check_table_exist(objectId):
    check_table_query = '''select OBJECT_ID('{}')'''.format(objectId)
    try:
        cursor.execute(check_table_query)
        row = cursor.fetchone()
        if row[0]:
            return True
        else:
            return False
    except:
        return False


def check_component_exist(table, id):
    check_query = '''select * from {} where component_id = ?'''.format(table)
    try:
        cursor.execute(check_query, id)
        row = cursor.fetchone()
        if row[0]:
            return True
        else:
            return False
    except:
        return False


def get_parentId(id):
    select_sql = '''select component_id from system_configuration where system_configuration.system in
                (select system from system_configuration where component_id = ?)
                    and system_configuration.ship_name in
                        (select ship_name from system_configuration where component_id = ?)
                and system_configuration.component_name in ((select system from system_configuration where component_id = ?))'''

    cursor.execute(select_sql, id, id, id)
    parent_id = cursor.fetchone()
    parent_id = parent_id[0]
    return parent_id

def add_user_selection_data(data):
    data = data["values"]
    command = data["command"]
    ship_name = data["ship_name"]
    department = data["department"]
    shipClass = data["shipClass"]
    ship_category = data["shipC"]

    insert_sql = '''insert into user_selection values (?,?,?,?,?)'''
    cursor.execute(insert_sql, ship_name, ship_category, shipClass, command, department)
    cnxn.commit()
