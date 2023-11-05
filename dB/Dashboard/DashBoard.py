from dB.dB_connection import cursor, cnxn
from flask import Flask, jsonify

class DashBoard():
    def fetch_users(self):
        sql = '''select * from users'''
        cursor.execute(sql)
        users = []
        for row in cursor.fetchall():
            user = {
                'id': row.id,
                'username': row.username,
                'password': row.password,
                'level': row.level
            }
            users.append(user)
        return jsonify(users)
    
    def update_user(self, data):
            # Assuming data is a dictionary containing the updated information
            # For example: {'username': 'new_username', 'password': 'new_password', 'level': 'new_level'}
            
            # Generate the SQL query for updating the user
            sql = '''
                UPDATE users
                SET 
                    username = ?,
                    password = ?,
                    level = ?
                WHERE id = ?
            '''
            
            # Get the values from data
            username = data.get('username', None)
            password = data.get('password', None)
            Uid = data.get('id', None)
            
            # Execute the update query
            cursor.execute(sql, (username, password, level, Uid))
            cnxn.commit()

            return jsonify({'message': 'User updated successfully'})
    
    def delete_user(self, data):
        sql = '''DELETE FROM users WHERE id = ?'''
        cursor.execute(sql, (data,))
        cnxn.commit()

        return jsonify({'message': 'User deleted successfully'})



