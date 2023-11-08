from dB.dB_connection import cursor, cnxn
from dB.dB_utility import check_table_exist
import bcrypt
import uuid
import base64
import hashlib
from cryptography.fernet import Fernet

class SignInDB:
    def __init__(self):
        self.table_init()
        cnxn.commit()

    def hash_uuid(self, user_uuid):
        hashed_uuid = hashlib.sha256(user_uuid.encode('utf-8')).digest()
        return hashed_uuid

    def encrypt_password(self, password, user_uuid):
        key = self.hash_uuid(user_uuid)
        cipher_suite = Fernet(base64.urlsafe_b64encode(key))
        encrypted_password = cipher_suite.encrypt(password.encode('utf-8'))
        return encrypted_password

    def table_init(self):
        is_exist = check_table_exist('users')
        actual_sql = '''
            CREATE TABLE users (
                user_id VARCHAR(500) PRIMARY KEY,
                username VARCHAR(500) UNIQUE,
                password VARCHAR(500),
                level NVARCHAR(2) CHECK (level IN ('L1', 'L2', 'L3', 'L4', 'L5', 'L6','S'))
            )
        '''
        try:
            if not is_exist:
                cursor.execute(actual_sql)
                default_user_sql = '''
                    INSERT INTO users (user_id, username, password, level)
                    VALUES (?, ?, ?, ?)
                '''
                user_uuid = str(uuid.uuid4())
                hashed_default_password = self.encrypt_password('Jake@123', user_uuid)
                cursor.execute(default_user_sql, user_uuid, 'Jake609', hashed_default_password, 'S')
        except Exception as e:
            print(e)
            pass
