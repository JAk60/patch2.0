from dB.dB_connection import cursor, cnxn
from flask import jsonify
from dB.Authentication.signin_dB import SignInDB
import bcrypt

class Authentication:
    def __init__(self):
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}
        SignInDB()

    def hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password

    def is_valid_password(self, password):
        # Check if the password meets the requirements
        if (
            len(password) >= 8
            and any(char.isupper() for char in password)
            and any(char.isalnum() for char in password)
        ):
            return True
        return False

    def sign_in(self, username, password):
        query = "SELECT * FROM users WHERE username = ?"
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            user_level = user.level
            self.success_return["message"] = {'message': 'User found.', 'username': username, 'level': user_level}
            return self.success_return
        else:
            self.error_return["message"] = "Invalid username or Password"
            return self.error_return
    

    def sign_up(self, username, password, level):
        if not self.is_valid_password(password):
            self.error_return["message"] = "Invalid password. \n Password should have at least one uppercase letter, any of this @, !, & * alphaumeric character  \n password at least 8 characters long."
            return self.error_return
        hashed_password = self.hash_password(password)

        try:
            query = "INSERT INTO users (username, password, level) VALUES (?, ?, ?)"
            cursor.execute(query, (username, hashed_password, level))
            cursor.commit()


            self.success_return["message"] =  f"{username}'s Account is Created. Please Login"
            return self.success_return

        except Exception as e:
            self.error_return["message"] = "User is Already Present"
            return self.error_return






    
