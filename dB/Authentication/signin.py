from dB.dB_connection import cursor, cnxn
from flask import jsonify
from dB.Authentication.signin_dB import SignInDB
import uuid
import base64
import bcrypt
from cryptography.fernet import Fernet
import hashlib

# Assuming you have the necessary imports and initializations

class Authentication:
    def __init__(self):
        self.success_return = {"message": "Data Saved Successfully.", "code": 1}
        self.error_return = {"message": "Some Error Occurred, Please try again.", "code": 0}
        SignInDB()
    def generate_uuid(self):
        return str(uuid.uuid4())

    def hash_uuid(self, user_uuid):
        hashed_uuid = hashlib.sha256(user_uuid.encode('utf-8')).digest()
        return hashed_uuid

    def encrypt_password(self, password, user_uuid):
        key = self.hash_uuid(user_uuid)
        cipher_suite = Fernet(base64.urlsafe_b64encode(key))
        encrypted_password = cipher_suite.encrypt(password.encode('utf-8'))
        return encrypted_password

    def decrypt_password(self, encrypted_password, user_uuid):

        key = self.hash_uuid(user_uuid)
        cipher_suite = Fernet(base64.urlsafe_b64encode(key))
        decrypted_password = cipher_suite.decrypt(bytes(encrypted_password,'utf-8'))
        return decrypted_password.decode('utf-8')



    def is_valid_password(self, password):
        # Check if the password meets the requirements
        if len(password) >= 8 and any(char.isupper() for char in password) and any(
            char.isalnum() for char in password
        ):
            return True
        return False

    def sign_in(self, username, password):
        query = "SELECT * FROM users WHERE username = ?"
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if user:
            user_id = user.user_id  # Assuming 'user_id' is the column name for the UUID in the database
            encrypted_password = user.password  # Assuming 'password' is the column name for the encrypted password in the database
            decrypted_password = self.decrypt_password(encrypted_password, user_id)

            if password==decrypted_password:
                user_level = user.level
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
        hashed_password = self.encrypt_password(password, user_uuid)

        try:
            query = "INSERT INTO users (user_id, username, password, level) VALUES (?, ?, ?, ?)"
            cursor.execute(query, (user_uuid, username, hashed_password, level))
            cnxn.commit()

            self.success_return["message"] = f"{username}'s Account is Created. Please Login"
            return self.success_return

        except Exception as e:
            self.error_return["message"] = "User is Already Present"
            return self.error_return
