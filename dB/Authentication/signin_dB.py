from dB.dB_connection import cursor, cnxn
from dB.dB_utility import check_table_exist
import bcrypt
import uuid

class SignInDB:
    def __init__(self):
        self.table_init()

    def make_password_hash(self, password):
        hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return hash.decode('utf-8')

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
            with cnxn, cursor:
                if not is_exist:
                    cursor.execute(actual_sql)
                    default_user_sql = '''
                        INSERT INTO users (user_id, username, password, level)
                        VALUES (?, ?, ?, ?)
                    '''
                    user_uuid = str(uuid.uuid4())
                    username = 'Jake609'
                    password = 'Jake@123'
                    hashed_default_password = self.make_password_hash(password)
                    cursor.execute(default_user_sql, user_uuid, username, hashed_default_password, 'S')
        except Exception as e:
            print(f"Error during table initialization: {e}")
            raise e  # Raising the exception for visibility
