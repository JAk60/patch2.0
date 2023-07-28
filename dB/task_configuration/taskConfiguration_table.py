from dB.dB_utility import check_table_exist
from dB.dB_connection import cursor, cnxn


class taskConfiguration_Table:
    def __init__(self):
        """Initialize the class which creates phase_manager all tables 
        if they are not created."""
        self.initialize_tables()
        cnxn.commit()

    def initialize_tables(self):
        is_exist = check_table_exist('task_configuration')
        if not is_exist:
            sb_sql = '''create table task_configuration
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                task_name varchar(8000) not null

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass

        is_exist = check_table_exist('task_components')
        if not is_exist:
            sb_sql = '''create table task_components
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                task_id varchar(8000) not null
                                constraint task_components_task_configuration_id_fk
                                                                references task_configuration,
                                equipment_name varchar(8000) not null,
                                equipment_id varchar(8000) not null,
                                parent_id varchar(8000) not null,
                                k varchar(200) not null,
                                n varchar(200) not null

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass

        is_exist = check_table_exist('task_parallel_data')
        if not is_exist:
            sb_sql = '''create table task_parallel_data
                            (
                                task_id varchar(8000) not null,
                                equipment_id varchar(8000) not null,
                                parallel_id varchar(8000) not null

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass
        
        