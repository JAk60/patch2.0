import uuid

import bcrypt  # Import bcrypt for password hashing
from flask import jsonify

from dB.Authentication.signin_dB import SignInDB
from dB.dB_connection import cnxn, cursor

# Assuming you have the necessary imports and initializations

class Authentication:
    def __init__(self):
        self.success_return = {"message": "Data Saved Successfully.", "code": 1}
        self.error_return = {"message": "Some Error Occurred, Please try again.", "code": 0}
        SignInDB()

    def generate_uuid(self):
        return str(uuid.uuid4())

    def is_valid_password(self, password):
        # Check if the password meets the requirements
        if len(password) >= 8 and any(char.isupper() for char in password) and any(
            char.isalnum() for char in password
        ):
            return True
        return False

    def make_password_hash(self, password):
            hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            return hash.decode('utf-8')

    def is_password_valid(self, password, hashed_password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

    def sign_in(self, username, password):
        query = "SELECT * FROM users WHERE username = ?"
        cursor.execute(query, (username,))
        user = cursor.fetchone()
    
        print(user)

        if user:
            stored_hashed_password = user[2]  # Assuming 'password' is the column name for the hashed password in the database

            if self.is_password_valid(password, stored_hashed_password):
                user_level = user[3]  # Assuming 'level' is the column name for the user's level
                self.success_return["message"] = {'message': 'User found.', 'username': username, 'level': user_level}
                return self.success_return
            else:
                self.error_return["message"] = "Invalid username or password"
                return self.error_return
        else:
            self.error_return["message"] = "User not found"
            return self.error_return


    def sign_up(self, username, password, level):
        if not self.is_valid_password(password):
            self.error_return["message"] = "Invalid password. \n Password should have at least one uppercase letter, any of this @, !, & * alphanumeric character  \n password at least 8 characters long."
            return self.error_return

        user_uuid = self.generate_uuid()
        hashed_password = self.make_password_hash(password)
        try:
            query = "INSERT INTO users (user_id, username, password, level) VALUES (?, ?, ?, ?)"
            cursor.execute(query, (user_uuid, username, hashed_password, level))
            cnxn.commit()

            return {
                "code": 1,
                "message": f"{username}'s account is created. Please login."
            }

        except Exception as e:
            return {
                "code": 409,
                "message": "User already exists"
            }
