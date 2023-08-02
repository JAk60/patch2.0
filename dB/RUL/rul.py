from dB.dB_connection import cursor, cnxn
from flask import jsonify

class RUL_dB:
    def __init__(self):
        self.success_return = {"message": "Data Retrieved Successfully.", "code": 1}
        self.error_return = {"message": "Some Error Occurred, Please try again.", "code": 0}

    def get_prev_rul(self, p):
        try:
            sql = f"SELECT TOP 1 * FROM parameter_data WHERE name = ?  ORDER BY date DESC;"
            cursor.execute(sql, p)
            data = cursor.fetchone()

            if data:
                # Extract the desired columns from the result row
                data_value = data[3]  # Assuming data_value is the first column
                name = data[4]        # Assuming name is the second column
                operating_hours = data[6]  # Assuming operating_hours is the third column

                # Return the retrieved data in a dictionary format
                return {
                    "data_value": data_value,
                    "name": name,
                    "operating_hours": operating_hours,
                }
            else:
                # Return an error message if no data is found
                return {
                    "message": f"No data found for name '{p}'.",
                }
        except Exception as e:
            # Handle any exceptions and return an error message
            return {
                "message": str(e),
                "code": 0
            }

    def fetch_PF(self,equipment_id,name):
        try:
            # SQL query
            sql_query = '''
                SELECT P, F
                FROM sensor_based_data
                WHERE component_id = ? AND name = ?;
            '''

            # Execute the query
            cursor.execute(sql_query,equipment_id,name)

            # Fetch all rows
            data = cursor.fetchall()

            # Convert the data to a list of dictionaries
            result = []
            for row in data:
                result.append({'P': row[0], 'F': row[1]})

            return jsonify(result)
        except Exception as e:
            # Handle any exceptions that might occur during the execution
            print(f"Error occurred: {str(e)}")
            return jsonify({'error': 'An error occurred.'}), 500
