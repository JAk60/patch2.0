from dB.dB_connection import cursor, cnxn
from flask import jsonify
import bcrypt


class DashBoard():
    def fetch_users(self, data):
        print(data)
        level = data["selectedLevel"]
        sql = '''select * from users where level=?'''
        cursor.execute(sql, level)
        users = []
        for row in cursor.fetchall():
            print(row.user_id)
            user = {
                'id': row.user_id,
                'username': row.username,
                'level': row.level
            }
            users.append(user)
        return jsonify(users)

    def make_password_hash(self, password):
        hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return hash.decode('utf-8')

    def update_user(self, data):

        sql = '''
                UPDATE users
                SET 
                    password = ?
                WHERE user_id = ?
            '''

        password = str(data.get('newPassword', None))
        user = data.get('user', None)
        Uid = data.get('userId', None)
        hashed_password = self.make_password_hash(password)
        # Execute the update query
        cursor.execute(sql, (hashed_password, Uid))
        cnxn.commit()

        return jsonify({'message': f'password changed for {user}'})

    def delete_user(self, data):
        userId = data["id"]
        sql = '''DELETE FROM users WHERE user_id = ?'''
        cursor.execute(sql, (userId,))
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
