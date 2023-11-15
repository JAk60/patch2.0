from dB.dB_connection import cursor, cnxn
from flask import Flask, jsonify
import base64
import hashlib
from cryptography.fernet import Fernet

class DashBoard():
    def hash_uuid(self, user_uuid):
        hashed_uuid = hashlib.sha256(user_uuid.encode('utf-8')).digest()
        return hashed_uuid
    
    def decrypt_password(self, encrypted_password, user_uuid):
        key = self.hash_uuid(user_uuid)  # Ensure that the hash_uuid function is accessible
        cipher_suite = Fernet(base64.urlsafe_b64encode(key))
        decrypted_password = cipher_suite.decrypt(encrypted_password)
        return decrypted_password.decode('utf-8')

    def fetch_users(self):
        sql = '''select * from users'''
        cursor.execute(sql)
        users = []
        for row in cursor.fetchall():
            print(row.user_id)
            decrypted_password = self.decrypt_password(row.password, row.user_id)
            user = {
                'id': row.user_id,
                'username': row.username,
                'password': decrypted_password,
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
                WHERE user_id = ?
            '''

        # Get the values from data
        username = data.get('username', None)
        password = data.get('password', None)
        level = data.get('level', None)
        Uid = data.get('id', None)

        # Execute the update query
        cursor.execute(sql, (username, password, level, Uid))
        cnxn.commit()

        return jsonify({'message': 'User updated successfully'})

    def delete_user(self, data):
        sql = '''DELETE FROM users WHERE user_id = ?'''
        cursor.execute(sql, (data,))
        cnxn.commit()

        return jsonify({'message': 'User deleted successfully'})

    def card_counts(self):
        # Query 1: Count of users
        cursor.execute('SELECT COUNT(*) FROM users')
        users_count = cursor.fetchone()[0]

        # Query 2: Count of nomenclature from system_configuration
        cursor.execute('SELECT COUNT(nomenclature) FROM system_configuration')
        equipments_count = cursor.fetchone()[0]

        # Query 3: Count of distinct ship names from system_configuration
        cursor.execute(
            'SELECT COUNT(DISTINCT ship_name) FROM system_configuration')
        ships_count = cursor.fetchone()[0]

        # Construct the response
        response = [
            {'title': 'Equipments', 'count': equipments_count},
            {'title': 'Ships', 'count': ships_count},
            {'title': 'Users', 'count': users_count}
        ]

        return jsonify(response)
