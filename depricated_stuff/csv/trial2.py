import pandas as pd
import numpy as np
from dB.dB_connection import cnxn, cursor


def read_excel():
    sys_config = pd.read_csv('classes/data.csv')

    eb = pd.read_csv('classes/eta_beta.csv')

    eb_insert = '''insert into eta_beta (id, eta, beta, component_id) values (?,?,?,?);'''

    sys_insert = '''insert into system_configuration (component_id, component_name, parent_id, part_code, 
                        is_lmu, parent_name, ship_name,
                                    ship_category, ship_class, command, department, system)
                    values (?,?,?,?,?,?,?,?,?,?,?,?);'''

    # for index, r in sys_config.iterrows():
    #     id = r['id']
    #     component_name = r['component_name']
    #     part_code = r['part_code']
    #     is_lmu = int(r['is_lmu'])
    #     parent_name = r['parent_name']
    #     parent_id = str(r['parent_id'])
    #     if parent_id == 'nan':
    #         parent_id = None
    #     ship_name = r['ship_name']
    #     ship_category = r['ship_category']
    #     ship_class = r['ship_class']
    #     command = r['command']
    #     department = r['department']
    #     system_head = r['system']
    #     cursor.execute(sys_insert, id, component_name, parent_id,
    #                    part_code, is_lmu, parent_name, ship_name, ship_category,
    #                    ship_class, command, department, system_head)

    # cursor.commit()
    for index, r in eb.iterrows():
        componenet_id = r['component_id']
        eta = r['eta']
        beta = r['beta']
        id = r['id']
        cursor.execute(eb_insert, id, eta, beta, componenet_id)
    cursor.commit()
    print('Hello')
