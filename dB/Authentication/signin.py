from dB.dB_connection import cursor, cnxn
from flask import jsonify
from dB.Authentication.signin_dB import SignInDB
import bcrypt

class Authentication:
    def __init__(self):
        SignInDB()
        pass

    def hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password

    def sign_in(self, username, password):
        query = "SELECT * FROM users WHERE username = ?"
        cursor.execute(query, username)
        user = cursor.fetchone()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            user_level = user.level
            return {'message': 'User found.', 'username': username, 'level': user_level}
        else:
            return {'error': 'Invalid username or password.'}, 401
    

    def sign_up(self, username, password, level):
        print(username, password)
        hashed_password = self.hash_password(password)
        print(hashed_password)
        try:
            query = "INSERT INTO users (username, password, level) VALUES (?, ?, ?)"
            cursor.execute(query, (username, hashed_password, level))
            cursor.commit()


            return {
                "messege": "user is created successfully"
            }

        except Exception as e:
            return {
                "messege": "user is already present"
            }







    
