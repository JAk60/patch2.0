from datetime import datetime
import logging
from dB.dB_connection import pointer, cnxn ,cursor
from flask import Flask, jsonify
from dB.data_manager.data_manager import Data_Manager

class ETL():
    def etl_src_target(self):
        try:
            SysConfigQuery = '''select * from operational_data'''
            # Execute a SELECT query on the target database
            pointer.execute(SysConfigQuery)
            rows = pointer.fetchall()

            # Convert rows to a list of dictionaries for JSON serialization
            result = [{'oid': row[0], 'id': row[1], 'Date': row[2], 'AverageRunning': row[3]} for row in rows]

            response_data = {'data': result}
            for d in response_data["data"]:
                id_ = d["oid"]
                component_id = d["id"]
                operation_date = d["Date"]
                date_ = datetime.strptime(str(operation_date), "%Y-%m-%d")
                average_running = d["AverageRunning"]
                print(id_, component_id, operation_date, date_, average_running)
                merge_opdata = """
                    MERGE INTO operational_data AS target
                    USING (VALUES (?, ?, ?, ?)) AS source (id, component_id, operation_date, average_running)
                    ON target.component_id = source.component_id AND target.operation_date = source.operation_date
                    WHEN MATCHED THEN
                        UPDATE SET average_running = ?
                    WHEN NOT MATCHED THEN
                        INSERT (id, component_id, operation_date, average_running)
                        VALUES (?, ?, ?, ?);
                """

                cursor.execute(merge_opdata, (id_, component_id, date_, average_running, average_running, id_, component_id, date_, average_running))

            cnxn.commit()
            print(response_data)

            # data_manager_instance = Data_Manager()
            # Call the insert_data method from the Data_Manager class and pass the data
            # data_manager_instance.insert_opdata(response_data)

            return jsonify(response_data)

        except Exception as e:
            logging.error(f'Error in ETL process: {str(e)}')
            cnxn.rollback()  # Rollback changes in case of an error
            return jsonify({'status': 'error', 'message': f'Error fetching or updating data: {str(e)}'})
