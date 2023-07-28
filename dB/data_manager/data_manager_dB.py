from dB.dB_connection import cursor, cnxn
from dB.dB_utility import check_table_exist


class DataManagerDB:
    def __init__(self):
        self.table_init()
        cnxn.commit()

    def table_init(self):
        is_exist = check_table_exist('data_manager_actual_data')
        if not is_exist:
            actual_sql = '''create table data_manager_actual_data
                            (
                                id                  varchar(200) not null
                                    constraint data_manager_actual_data_pk
                                        primary key nonclustered,
                                interval_start_date date,
                                component_id        varchar(8000)
                                    constraint data_manager_actual_data_system_configuration_component_id_fk
                                        references system_configuration,
                                f_s                 varchar(100),
                                interval_end_date   date
                            )'''
            cursor.execute(actual_sql)
        is_exist = check_table_exist('data_manager_interval_data')
        if not is_exist:
            interval_sql = '''create table data_manager_interval_data
                                (
                                    id                      varchar(200),
                                    installation_start_date date,
                                    installation_end_date   date,
                                    component_id            varchar(8000)
                                        constraint data_manager_interval_data_system_configuration_component_id_fk
                                            references system_configuration,
                                    f_s                     varchar(200),
                                    removal_start_date      date,
                                    removal_end_date        date
                                )'''
            cursor.execute(interval_sql)
        is_exist = check_table_exist('data_manager_oem')
        if not is_exist:
            oem_sql = '''create table data_manager_oem
                    (
                        id VARCHAR(200)
                            constraint data_manager_oem_pk
                                primary key nonclustered,
                        life_estimate1_name VARCHAR(200),
                        life_estimate1_val FLOAT,
                        life_estimate2_name VARCHAR(200),
                        life_estimate2_val FLOAT,
                        component_id VARCHAR(8000)
                            constraint data_manager_oem_system_configuration_component_id_fk
                                references system_configuration
                    )'''
            cursor.execute(oem_sql)
        is_exist = check_table_exist('data_manager_oem_expert')
        if not is_exist:
            oem_expert_sql = '''create table data_manager_oem_expert
                                (
                                    id                       varchar(200) not null
                                        constraint data_manager_oem_expert_pk
                                            primary key nonclustered,
                                    most_likely_life         float,
                                    max_life                 float,
                                    min_life                 float,
                                    life_estimate_name       varchar(200),
                                    life_estimate_val        float,
                                    component_id             varchar(8000)
                                        constraint data_manager_oem_expert_system_configuration_component_id_fk
                                            references system_configuration,
                                    num_component_wo_failure float,
                                    time_wo_failure          float
                                )'''
            cursor.execute(oem_expert_sql)
        is_exist = check_table_exist('data_manager_expert')
        if not is_exist:
            expert_sql = '''create table data_manager_expert
                            (
                                id                       varchar(200) not null
                                    constraint data_manager_expert_pk
                                        primary key nonclustered,
                                most_likely_life         float,
                                max_life                 float,
                                min_life                 float,
                                component_id             varchar(8000)
                                    constraint data_manager_expert_system_configuration_component_id_fk
                                        references system_configuration,
                                num_component_wo_failure float,
                                time_wo_failure          float
                            )'''
            cursor.execute(expert_sql)
        is_exist = check_table_exist('data_manager_prob_failure')
        if not is_exist:
            prob_failure = '''create table data_manager_prob_failure
                            (
                                id VARCHAR(200)
                                    constraint data_manager_prob_failure_pk
                                        primary key nonclustered,
                                p_time FLOAT,
                                failure_p FLOAT,
                                component_id VARCHAR(8000)
                                    constraint data_manager_prob_failure_system_configuration_component_id_fk
                                        references system_configuration
                            )'''
            cursor.execute(prob_failure)
        is_exist = check_table_exist('data_manager_nprd')
        if not is_exist:
            nprd_sql = '''create table data_manager_nprd
                        (
                            id VARCHAR(200)
                                constraint data_manager_nprd_pk
                                    primary key nonclustered,
                            failure_rate FLOAT,
                            beta FLOAT,
                            component_id VARCHAR(8000)
                                constraint data_manager_nprd_system_configuration_component_id_fk
                                    references system_configuration
                        )'''
            cursor.execute(nprd_sql)
        is_exist = check_table_exist('data_manager_replacable_import')
        if not is_exist:
            import_replacable_sql = '''create table data_manager_replacable_import
                                (
                                    id VARCHAR(200)
                                        constraint data_manager_replacable_import_pk
                                            primary key nonclustered,
                                    eta FLOAT,
                                    beta FLOAT,
                                    component_id VARCHAR(8000)
                                        constraint data_manager_replacable_import_system_configuration_component_id_fk
                                            references system_configuration
                                )'''
            cursor.execute(import_replacable_sql)
        is_exist = check_table_exist('data_manager_repairable_import')
        if not is_exist:
            import_repairable_sql = '''create table data_manager_repairable_import
                                (
                                    id VARCHAR(200)
                                        constraint data_manager_repairable_import_pk
                                            primary key nonclustered,
                                    alpha FLOAT,
                                    beta FLOAT,
                                    component_id VARCHAR(8000)
                                        constraint data_manager_repairable_import_system_configuration_component_id_fk
                                            references system_configuration
                                )'''
            cursor.execute(import_repairable_sql)

        is_exist = check_table_exist('TTF_data')
        if not is_exist:
            sql = '''create table TTF_data
                    (
                        id VARCHAR(200)
                            constraint TTF_data_pk
                                primary key nonclustered,
                        hours FLOAT,
                        component_id VARCHAR(8000)
                            constraint TTF_data_system_configuration_component_id_fk
                                references system_configuration,
                        f_s VARCHAR(200),
                        priority int
                    )'''
            cursor.execute(sql)

        is_exist = check_table_exist('eta_beta')
        if not is_exist:
            sql = '''create table eta_beta
                    (
                        id           varchar(45) not null
                            constraint eta_beta_pk
                                primary key nonclustered,
                        eta          float,
                        beta         float,
                        component_id varchar(8000)
                            constraint eta_beta_system_configuration_component_id_fk
                                references system_configuration,
                        priority     int
                    )'''
            cursor.execute(sql)

        is_exist = check_table_exist('last_run_MLE_track')
        if not is_exist:
            sql = '''create table last_run_MLE_track
                        (
                            date date
                        )'''
            cursor.execute(sql)
        is_exist = check_table_exist('operational_data')
        if not is_exist:
            sql = '''create table operational_data
                        (
                            id              varchar(200) not null
                                constraint operational_data_pk
                                    primary key nonclustered,
                            component_id    varchar(8000)
                                constraint operational_data_system_configuration_component_id_fk
                                    references system_configuration,
                            operation_date  date,
                            average_running int
                        )'''
            cursor.execute(sql)

        is_exist = check_table_exist('data_manager_maintenance_data')
        if not is_exist:
            sql = '''create table data_manager_maintenance_data
                        (
                            id                      varchar(200) not null
                                constraint data_manager_maintenance_data_pk
                                    primary key nonclustered,
                            component_id            varchar(8000)
                                constraint data_manager_maintenance_data_system_configuration_component_id_fk
                                    references system_configuration,
                            event_type              varchar(200),
                            maint_date              date,
                            maintenance_type        varchar(200),
                            replaced_component_type varchar(200),
                            cannabalised_age        varchar(100),
                            maintenance_duration    float,
                            failure_mode            varchar(8000),
                            description             varchar(max)
                        )'''
            cursor.execute(sql)
