from dB.dB_connection import cursor, cnxn
from dB.task_configuration.taskConfiguration_table import taskConfiguration_Table

from uuid import uuid4


class taskConfiguration_dB():
    def __init__(self):
        taskConfiguration_Table()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}

    def insertTaskData(self, data):
        main_node=data[0]
        component_nodes=data[1:]
        # print(main_node)
        #print(data)
        try:
            
            task_id = main_node['id']
            task_name=main_node['data']['label']
            
            insert_task = '''INSERT INTO task_configuration (id, task_name)
                                    VALUES (?, ?);'''

            cursor.execute(insert_task, task_id, task_name)

            for component in component_nodes:
                id=component['id']
                eqpt_name=component['data']['label']
                eqpt_id=component['equipmentId']
                parent_id=component['parentId']
                k=component['data']['k']
                n=component['data']['n']

                insert_task_component='''INSERT INTO task_components (id,task_id,equipment_name,equipment_id,
                parent_id,k,n) VALUES (?, ?, ?, ?, ?, ?, ?)'''

                cursor.execute(insert_task_component,id,task_id,eqpt_name,eqpt_id,parent_id,k,n)

                for pc in component['data']['parallel_comp']:
                    parallel_id=pc['value']
                    insert_pc='''INSERT INTO task_parallel_data (task_id,equipment_id,parallel_id)
                    VALUES (?, ?, ?)'''
                    cursor.execute(insert_pc,task_id,eqpt_id,parallel_id)

            cursor.commit()
            return self.success_return
        except Exception as e:
            print(e)
            self.error_return['message'] = str(e)
            return self.error_return

    