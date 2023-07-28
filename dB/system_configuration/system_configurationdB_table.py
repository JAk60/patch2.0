from dB.dB_connection import cursor, cnxn
from dB.dB_utility import check_table_exist


class SystemConfigurationdBTable:
    def __init__(self):
        """Initialize the class which creates system_config all tables 
        if they are not created."""
        self.initialize_tables()

    def initialize_tables(self):
        is_exist = check_table_exist('system_configuration')
        if not is_exist:
            create_sql_configuration = '''create table system_configuration
                                                (
                                                    component_id   varchar(8000) not null
                                                        constraint system_configuration_pk
                                                            primary key nonclustered,
                                                    component_name varchar(max)  not null,
                                                    parent_id      varchar(8000),
                                                    part_code      varchar(200),
                                                    is_lmu         int default 1,
                                                    parent_name    varchar(8000),
                                                    ship_name      varchar(max),
                                                    ship_category  varchar(max),
                                                    ship_class     varchar(max),
                                                    command        varchar(max),
                                                    department     varchar(max),
                                                    system         varchar(8000)
                                                )

                                            create unique index system_configuration_component_id_uindex
                                                on system_configuration (component_id)
                                            '''
        is_exist = check_table_exist('redundancy_data')
        if not is_exist:
            create_sql_redundancy_data = '''create table redundancy_data
                                                (
                                                    redundancy_id      varchar(8000) not null
                                                        constraint redundancy_data_pk
                                                            primary key nonclustered,
                                                    component_id       varchar(8000) not null
                                                        constraint redundancy_data_system_configuration_component_id_fk
                                                            references system_configuration,
                                                    k                  varchar,
                                                    n                  int,
                                                    redundancy_type    varchar(8000),
                                                    system_name        varchar(max),
                                                    system_parent_name varchar(max)
                                                )
                                                '''
        is_exist = check_table_exist('maintenance_configuration_data')
        if not is_exist:
            create_sql_maintenance_configuration_data = '''create table maintenance_configuration_data
                                                            (
                                                                maintenance_id                varchar(8000) not null
                                                                    constraint maintenance_configuration_data_pk
                                                                        primary key nonclustered,
                                                                component_id                  varchar(8000) not null
                                                                    constraint maintenance_configuration_data_system_configuration_component_id_fk
                                                                        references system_configuration,
                                                                repair_type                   varchar(8000),
                                                                pm_applicable                 varchar(20),
                                                                pm_interval                   float,
                                                                can_be_replaced_by_ship_staff varchar(20),
                                                                is_system_param_recorded      varchar(20)
                                                            )'''

        is_exist = check_table_exist('parallel_configuration')
        if not is_exist:
            create_sql_parallel_configuration = '''create table parallel_configuration
                                                    (
                                                        redundancy_id varchar(8000) not null
                                                            constraint parallel_configuration_redundancy_data_redundancy_id_fk
                                                                references redundancy_data,
                                                        component_id  varchar(8000) not null
                                                            constraint parallel_configuration_system_configuration_component_id_fk
                                                                references system_configuration
                                                    )
                                                    go

                                                    exec sp_addextendedproperty 'MS_Description', 'This Table maints the record of all parallel information', 'SCHEMA',
                                                        'dbo', 'TABLE', 'parallel_configuration'
                                                    go'''

        is_exist = check_table_exist('failure_modes')
        if not is_exist:
            create_sql_failure_mode = '''create table failure_modes
                                            (
                                                failure_mode_id  varchar(8000) not null,
                                                component_id     varchar(8000) not null,
                                                failure_mode     varchar(8000),
                                            )'''

        is_exist = check_table_exist('duty_cycle')
        if not is_exist:
            create_sql_duty_cycle = '''create table duty_cycle
                                        (
                                            duty_cycle_id    varchar(8000) not null
                                                constraint duty_cycle_pk
                                                    primary key nonclustered,
                                            component_id     varchar(8000) not null
                                                constraint duty_cycle_system_configuration_component_id_fk
                                                    references system_configuration,
                                            duty_cycle_value float
                                        )
                                        go'''
        is_exist = check_table_exist('system_config_additional_info')
        if not is_exist:
            create_sql_additional_sql = '''create table system_config_additional_info
                                            (
                                                id                      varchar(200) not null
                                                    constraint system_config_additional_info_pk
                                                        primary key nonclustered,
                                                component_id            varchar(8000)
                                                    constraint system_config_additional_info_system_configuration_component_id_fk
                                                        references system_configuration,
                                                component_name          varchar(8000),
                                                num_cycle_or_runtime    float,
                                                installation_date       date,
                                                unit                    varchar(8000),
                                                harbour_k               varchar(10),
                                                elh_k                   varchar(10),
                                                cruise_k                varchar(10),
                                                defense_k               varchar(10),
                                                action_k                varchar(10),
                                                maint_data_availability varchar(100)
                                            )'''
        is_exist = check_table_exist('system_config_additional_info_parallel')
        if not is_exist:
            create_sql_additional_parallel = '''
                                create table system_config_additional_info_parallel
                                        (
                                            id           varchar(8000),
                                            component_id varchar(8000)
                                                constraint system_config_additional_info_parallel_system_configuration_component_id_fk
                                                    references system_configuration
                                        )
                                                    '''
        try:
            cursor.execute(create_sql_configuration)
            cursor.execute(create_sql_redundancy_data)
            cursor.execute(create_sql_parallel_configuration)
            cursor.execute(create_sql_maintenance_configuration_data)
            cursor.execute(create_sql_failure_mode)
            cursor.execute(create_sql_duty_cycle)
            cursor.execute(create_sql_additional_sql)
            cursor.execute(create_sql_additional_parallel)
            cnxn.commit()
            return "Tables Created Successfully!!"
        except:
            return "Some Error occured in creating all the tables!!"
