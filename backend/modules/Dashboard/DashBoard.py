from backend.dB.dB_connection import cursor, cnxn
from flask import jsonify
import bcrypt
from backend.dB.dashboard_query.dashboard_query import (
    FETCH_USERS_BY_LEVEL,
    UPDATE_USER_PASSWORD,
    DELETE_USER_BY_ID,
    COUNT_USERS,
    COUNT_EQUIPMENTS,
    COUNT_DISTINCT_SHIPS,
)


class DashBoard():
    def fetch_users(self, data):
        print(data)
        level = data["selectedLevel"]
        cursor.execute(FETCH_USERS_BY_LEVEL, level)
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
        password = str(data.get('newPassword', None))
        user = data.get('user', None)
        Uid = data.get('userId', None)
        hashed_password = self.make_password_hash(password)
        cursor.execute(UPDATE_USER_PASSWORD, (hashed_password, Uid))
        cnxn.commit()
        return jsonify({'message': f'password changed for {user}'})

    def delete_user(self, data):
        userId = data["id"]
        cursor.execute(DELETE_USER_BY_ID, (userId,))
        cnxn.commit()
        return jsonify({'message': 'User deleted successfully'})

    def card_counts(self):
        cursor.execute(COUNT_USERS)
        users_count = cursor.fetchone()[0]

        cursor.execute(COUNT_EQUIPMENTS)
        equipments_count = cursor.fetchone()[0]

        cursor.execute(COUNT_DISTINCT_SHIPS)
        ships_count = cursor.fetchone()[0]

        response = [
            {'title': 'Equipments', 'count': equipments_count},
            {'title': 'Ships', 'count': ships_count},
            {'title': 'Users', 'count': users_count}
        ]

        return jsonify(response)