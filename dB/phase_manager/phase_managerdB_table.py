from dB_utility import check_table_exist
from dB.dB_connection import cursor, cnxn


class Phase_ManagerdB_Table:
    def __init__(self):
        """Initialize the class which creates phase_manager all tables 
        if they are not created."""
        self.initialize_tables()
        cnxn.commit()

    def initialize_tables(self):
        is_exist = check_table_exist('phase_definition')
        if not is_exist:
            phase_sql = '''create table phase_definition
                            (
                                phase_id     varchar(8000) not null
                                    constraint phase_definition_pk
                                        primary key nonclustered,
                                component_id varchar(8000) not null,
                                phase_name   varchar(8000),
                                type         varchar(200) default 'quantative',
                                unit         varchar(200),
                                lower_bound  varchar(200),
                                upper_bound  varchar(200),
                                phase_range  varchar(200),
                                description  varchar(max)
                            )'''
            try:
                cursor.execute(phase_sql)
            except Exception as e:
                pass

        is_exist = check_table_exist('phase_detail')
        if not is_exist:
            phase_sql = '''create table phase_detail
                            (
                                phase_id            varchar(8000) not null
                                    constraint phase_detail_phase_definition_phase_id_fk
                                        references phase_definition,
                                phase_definition_id varchar(8000) not null
                                    constraint phase_detail_pk
                                        primary key nonclustered,
                                phase_range_name    varchar(8000),
                                quan_lower_bound    float,
                                quan_upper_bound    float,
                                description         varchar(max)
                            )
                            go

                            '''
            try:
                cursor.execute(phase_sql)
            except Exception as e:
                pass

        is_exist = check_table_exist('life_multiplier')
        if not is_exist:
            phase_sql = '''create table life_multiplier
                            (
                                life_multiplier_id VARCHAR(8000) not null
                                    constraint life_multiplier_pk
                                        primary key nonclustered,
                                phase_id VARCHAR(8000)
                                    constraint life_multiplier_phase_definition_phase_id_fk
                                        references phase_definition,
                                phase_definition_id VARCHAR(8000) not null
                                    constraint life_multiplier_phase_detail_phase_definition_id_fk
                                        references phase_detail,
                                component_id VARCHAR(8000) not null
                                    constraint life_multiplier_system_configuration_component_id_fk
                                        references system_configuration,
                                life_multiplier_value float default 1
                            )
                            go

                            '''
            try:
                cursor.execute(phase_sql)
            except Exception as e:
                pass

        is_exist = check_table_exist('system_duty_cycle')
        if not is_exist:
            phase_sql = '''create table system_duty_cycle
                            (
                                duty_cycle_id VARCHAR(8000) not null
                                    constraint system_duty_cycle_pk
                                        primary key nonclustered,
                                component_id VARCHAR(8000)
                                    constraint system_duty_cycle_system_configuration_component_id_fk
                                        references system_configuration,
                                phase_id VARCHAR(8000)
                                    constraint system_duty_cycle_phase_definition_phase_id_fk
                                        references phase_definition,
                                phase_Definition_id VARCHAR(8000)
                                    constraint system_duty_cycle_phase_detail_phase_definition_id_fk
                                        references phase_detail,
                                duty_cycle_value float default 1
                            )
                            go'''
            try:
                cursor.execute(phase_sql)
            except Exception as e:
                pass
