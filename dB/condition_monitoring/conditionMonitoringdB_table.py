from dB.dB_utility import check_table_exist
from dB.dB_connection import cursor, cnxn


class conditionMonitoringdB_Table:
    def __init__(self):
        """Initialize the class which creates phase_manager all tables 
        if they are not created."""
        self.initialize_tables()
        cnxn.commit()

    def initialize_tables(self):
        is_exist = check_table_exist('sensor_based_data')
        if not is_exist:
            sb_sql = '''create table sensor_based_data
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                component_id varchar(8000) not null
                                constraint sensor_based_data_system_configuration_component_id_fk
                                                                references system_configuration,
                                equipment_id varchar(8000) not null,
                                failure_mode_id   varchar(8000),
                                name varchar(8000) not null,
                                min_value varchar(200),
                                max_value varchar(200),
                                unit varchar(200),
                                level varchar(200),
                                frequency varchar(200),
                                data varchar(200)

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass
        
        is_exist = check_table_exist('sensor_parameter_attributes')
        if not is_exist:
            sb_sql = '''create table sensor_parameter_attributes
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                parameter_id   varchar(8000) not null
                                constraint sensor_parameter_attributes_sensor_based_data_id_fk
                                                                references sensor_based_data,
                                level varchar(200),
                                threshold varchar(200)

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass

        is_exist = check_table_exist('sensor_alarm_data')
        if not is_exist:
            sb_sql = '''create table sensor_alarm_data
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                               
                                alarm  varchar(200)  not null

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass

        is_exist = check_table_exist('sensor_alarm_attributes')
        if not is_exist:
            sb_sql = '''create table sensor_alarm_attributes
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                alarm_id   varchar(8000) not null
                                constraint sensor_alarm_attributes_sensor_alarm_data_id_fk
                                                                references sensor_alarm_data,
                                parameter_id   varchar(8000) not null
                                constraint sensor_alarm_attributes_sensor_based_data_id_fk
                                                                references sensor_based_data,
                                level_id   varchar(8000) not null
                                constraint sensor_alarm_attributes_sensor_parameter_attributes_id_fk
                                                                references sensor_parameter_attributes,
                                

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass

        is_exist = check_table_exist('parameter_data')
        if not is_exist:
            sb_sql = '''create table parameter_data
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                component_id varchar(8000) not null
                                constraint parameter_data_system_configuration_component_id_fk
                                                                references system_configuration,
                                parameter_id varchar(8000) not null
                                constraint parameter_data_sensor_based_data_id_fk
                                                                references sensor_based_data,
                                name varchar(8000) not null,
                                value varchar(200),
                                date varchar(200)

                            )'''
            try:
                cursor.execute(sb_sql)
            except Exception as e:
                print(e)
                pass
        
        