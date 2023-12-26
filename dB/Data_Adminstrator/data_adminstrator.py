from dB.dB_connection import pointer,cnxn, cursor
from flask import Flask, jsonify


class Data_Administrator:
    def delete_data_for_component(self, data):
        print(data)
        data = data["values"]
        component_id = data["component_id"]
        table_names = [
            "maintenance_configuration_data",
            "system_config_additional_info",
            "failure_modes",
            "duty_cycle",
            "operational_data",
            "data_manager_overhauls_info",
            "data_manager_overhaul_maint_data",
            "alpha_beta",
            "parameter_data",
            "sensor_based_data",
            "parallel_configuration",
            "redundancy_data",
            "system_configuration"
        ]

        for table_name in table_names:
            try:
                # Assuming 'component_id' is a column in each table
                delete_query = '''DELETE FROM {} WHERE component_id = ?'''.format(
                    table_name)
                cursor.execute(delete_query, (component_id,))
                cnxn.commit()  # Commit changes to the database
            except Exception as e:
                # Handle exceptions if needed
                print(f"Error deleting data from {table_name}: {str(e)}")
                return {"code": 0, "message": f"Error deleting data from {table_name}: {str(e)}"}

        return {"code": 1, "message": "Information successfully Deleted."}

    def del_specific_data(self, data):
        data_values = data.get("values", {})
        component_id = data_values.get("component_id", None)
        table_name = data_values.get("table", None)
        failure_mode = data_values.get("failure_mode", None)
        operation_date = data_values.get("operation_date", None)
        date = data_values.get("date", None)
        value = data_values.get("value", None)

        if not component_id or not table_name:
            print("Invalid data. Both 'component_id' and 'table' must be provided.")
            return {"message": "Invalid data. Both 'component_id' and 'table' must be provided."}

        try:
            if table_name == "failure_modes":
                # Assuming 'failure_mode' is a parameter for 'failure_modes' table
                fmodeQ = '''DELETE FROM failure_modes WHERE component_id = ? AND failure_mode= ?'''
                cursor.execute(fmodeQ, (component_id, failure_mode))
            elif table_name == "operational_data":
                # Assuming 'operation_date' is a parameter for 'operational_data' table
                opdQ = '''DELETE FROM operational_data WHERE component_id = ? and operation_date= ?'''
                cursor.execute(opdQ, (component_id, operation_date))
            elif table_name == "data_manager_overhaul_maint_data":
                # Assuming 'date' is a parameter for 'data_manager_overhaul_maint_data' table
                omQ = '''DELETE FROM data_manager_overhaul_maint_data WHERE component_id = ? AND date= ?'''
                cursor.execute(omQ, (component_id, date))
            elif table_name == "parameter_data":
                # Assuming 'value' is a parameter for 'parameter_data' table
                pmQ = '''DELETE FROM parameter_data WHERE component_id = ? AND value= ?'''
                cursor.execute(pmQ, (component_id, value))
            else:
                # For other tables with only 'component_id' as a parameter
                basic = '''DELETE FROM {} WHERE component_id = ?'''.format(
                    table_name)
                cursor.execute(basic, (component_id,))

            cnxn.commit()  # Commit changes to the database
            print(
                f"Deleted data from {table_name} for component_id {component_id}")
            return {"code": 1, "message": "Information successfully Deleted."}

        except Exception as e:
            # Handle exceptions if needed
            print(f"Error deleting data from {table_name}: {str(e)}")
            return {"code": 0, "message": f"Error deleting data from {table_name}: {str(e)}"}

    def specific_data(self, data):
        values = data["values"]
        component_id = values["component_id"]
        table_name = values["table"]

        # Query to get column names
        column_query = f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}';"

        # Query to get specific data based on component_id
        data_query = f"SELECT * FROM {table_name} WHERE component_id = ?;"

        try:
            # Execute the query to get column names
            cursor.execute(column_query)
            columns = [row.COLUMN_NAME for row in cursor.fetchall()]

            # Execute the query to get specific data based on component_id
            cursor.execute(data_query, component_id)
            rows = cursor.fetchall()

            # Convert rows to a list of dictionaries
            data = [dict(zip(columns, row)) for row in rows]

            # Update columns array to match the desired format
            columns_array = [
                {"field": col, "headerName": col.capitalize().replace("_", " "),
                 "width": 250}
                for col in columns
            ]

            # Response dictionary
            response = {"columns": columns_array,
                        "columnData": data, "code": 1}

            # Processing logic or return the response as needed
            return response

        except Exception as e:
            print(f"Error: {e}")

    def get_equipments_onship(self, data):
            try:
                shipName = data["shipName"]
                print(shipName)
                equpQ = '''SELECT component_name, nomenclature, etl 
                        FROM system_configuration 
                        WHERE ship_name = ?'''
                cursor.execute(equpQ, (shipName,))
                result = cursor.fetchall()
                equipments = [{"component_name": row[0], "nomenclature": row[1], "etl": row[2]} for row in result]
                return {"code": 1, "equipments": equipments}

            except KeyError:
                return {"status": "error", "message": "Missing 'shipName' in request data"}

            except Exception as e:
                return {"code":0, "message": f"Error fetching equipments on {shipName}: {str(e)}"}

    def register_equipment(self, data):
        try:
            ship_name = data['values']['shipName']
            nomenclature = data['values']['nomenclature']
            register_all = data['values']['registerAll']

            if register_all:
                # Run a query for registerAll being True
                query = '''
                    SELECT * FROM system_configuration WHERE ship_name= ?
                '''
                # Execute the query using the pointer object
                pointer.execute(query, (ship_name,))
            else:
                # Run a query for registerAll being False
                query = '''
                    SELECT * FROM system_configuration WHERE ship_name= ? AND nomenclature= ?
                '''
                # Execute the query using the pointer object
                pointer.execute(query, (ship_name, nomenclature))

            # Commit the changes to the database
            cnxn.commit()

            return jsonify({'status': 'success', 'message': 'Query executed successfully and changes committed.'})

        except Exception as e:
            cnxn.rollback()  # Rollback changes in case of an error
            return jsonify({'status': 'error', 'message': f'Error executing the query: {str(e)}'})
