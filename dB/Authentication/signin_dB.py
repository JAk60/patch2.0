from dB.dB_connection import cursor, cnxn
from dB.dB_utility import check_table_exist


class SignInDB:
    def __init__(self):
        self.table_init()
        cnxn.commit()

    def table_init(self):
        is_exist = check_table_exist('users')
        if not is_exist:
            actual_sql = '''
                CREATE TABLE users (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    username VARCHAR(500) UNIQUE,
                    password VARCHAR(500),
                    level NVARCHAR(2) CHECK (level IN ('L1', 'L2', 'L3', 'L4', 'L5', 'L6'))
                )
            '''
            cursor.execute(actual_sql)
