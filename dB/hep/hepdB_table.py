from dB.dB_utility import check_table_exist
from dB.dB_connection import cursor, cnxn


class hepdB_Table:
    def __init__(self):
        """Initialize the class which creates phase_manager all tables 
        if they are not created."""
        self.initialize_tables()
        cnxn.commit()

    def initialize_tables(self):
        is_exist = check_table_exist('hep_equipment_level')
        if not is_exist:
            hep_sql = '''create table hep_equipment_level
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                component_id varchar(8000) not null
                                constraint hep_equipment_level_system_configuration_component_id_fk
                                                                references system_configuration,
                                phase_name   varchar(8000) not null,
                                maintenance_policy varchar(8000) not null,
                                AT_N varchar(200),
                                AT_LTR varchar(200),
                                AT_HTR varchar(200),
                                AT_VHTR varchar(200),
                                stress_N varchar(200),
                                stress_L varchar(200),
                                stress_E varchar(200),

                            )'''
            try:
                cursor.execute(hep_sql)
            except Exception as e:
                pass
        is_exist = check_table_exist('hep_component_level')
        if not is_exist:
            component_level_sql = '''create table hep_component_level
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                component_id varchar(8000) not null
                                constraint hep_component_level_system_configuration_component_id_fk
                                                                references system_configuration,
                                complexity varchar(200),
                                ergonomics varchar(200),
                                procedure_available varchar(200),

                            )'''
            try:
                cursor.execute(component_level_sql)
            except Exception as e:
                pass
        
        is_exist = check_table_exist('hep_ext_factors')
        if not is_exist:
            ext_factors_sql = '''create table hep_ext_factors
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                component_id varchar(8000) not null
                                constraint hep_ext_factors_system_configuration_component_id_fk
                                                                references system_configuration,
                                exp_nominal varchar(200),
                                exp_low varchar(200),
                                exp_high varchar(200),
                                work_culture varchar(200),
                                fit_nominal varchar(200),
                                fit_low varchar(200),
                                fit_high varchar(200),

                            )'''
            try:
                cursor.execute(ext_factors_sql)
            except Exception as e:
                pass        

        is_exist = check_table_exist('hep_life_multiplier')
        if not is_exist:
            life_multiplier_sql = '''create table hep_life_multiplier
                            (
                                id     varchar(8000) not null
                                        primary key nonclustered,
                                component_id varchar(8000) not null
                                constraint hep_life_multiplier_system_configuration_component_id_fk
                                                                references system_configuration,
                                refurbished varchar(200),
                                cannibalised varchar(200),
                                non_oem varchar(200),

                            )'''
            try:
                cursor.execute(life_multiplier_sql)
            except Exception as e:
                pass

    