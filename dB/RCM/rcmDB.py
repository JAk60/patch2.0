from dB.dB_connection import cursor, cnxn
from uuid import uuid4
from dB.RCM.rcm_tables import RCM_Tables
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import  inch, A3, landscape
from reportlab.platypus import Image, SimpleDocTemplate, Table, PageBreak, Spacer, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
# from db.RCM.report_gen import ReportGeneration
from dB.RCM.report_gen import ReportGeneration
class RCMDB():
    def __init__(self):
        RCM_Tables()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}
        
    def save_asm(self, data):
        try:
            print(data, "rcm_asm")
            system = data["system"]
            ship_name = data["ship_name"]
            insert_sql = '''insert into rcm_asm values(?,?,?,?,?,?)'''
            data = data["asm_data"]
            if len(data) > 0:
                parent_id = data[0]["parentId"]
                self.delete_asm(parent_id)
            for f in data:
                parent_id = f["parentId"]
                name = f["nomenclature"]
                uid = uuid4()
                comp_id = f["id"]
                cursor.execute(insert_sql, uid, system, ship_name, name, parent_id, comp_id)
            cursor.commit()
            return self.success_return
        except Exception as e:
            return self.error_return
        
    def delete_asm(self, parent_id):
        delete_sql = '''delete from rcm_asm where equipment_id=?'''
        cursor.execute(delete_sql, parent_id)

    def fetch_saved_asm(self, data):
        print(data)
        select_sql = '''select * from rcm_asm where component = ? and platform = ?'''
        eq = data["nomenclature"]
        platform = data["ship_name"]
        cursor.execute(select_sql, eq, platform)
        asm_d = cursor.fetchall()
        mData = []
        for d in asm_d:
            mData.append({"id": d[0], "parentName": d[1], "platform": d[2], "nomenclature": d[3],
                          "equipment_id": d[4], "component_id": d[5]}) 
        return mData


    def save_component_rcm(self, data):
        try:
            system = data["system"]
            ship_name = data["ship_name"]
            assembly = data["assembly"]
            system_id = assembly["equipment_id"]
            component = data["component"]
            rcm_val = data["rcm_val"]
            insert_sql = '''insert into rcm_component values(?,?,?,?,?,?,?)'''
            update_sql = '''update rcm_component set rcm=? where component_id=?'''
            check_sql = '''select * from rcm_component where component_id=?'''
            
            for comp in component:
                comp_name = comp["name"]
                parent_name = comp["parentName"]
                comp_id = comp["id"]
                parent_id = comp["parentId"]
                
                cursor.execute(check_sql, comp_id)
                if_exists = cursor.fetchone()
                if if_exists:
                    cursor.execute(update_sql, rcm_val, comp_id)  # Use cursor.execute for update
                else:
                    cursor.execute(insert_sql, comp_id, comp_name, rcm_val, parent_id, parent_name, system, ship_name)
            
            cnxn.commit()
            return self.success_return
        except Exception as e:
            return self.error_return


    def generate_rcm_report(self, APP_ROOT, SYSTEM, PLATFORM):
        try:
            target = os.path.join(APP_ROOT, 'netra\public\{0}-{1}.pdf'.format(PLATFORM.replace(' ',''), SYSTEM.replace(' ','')))
            if os.path.isfile(target):
                os.remove(target)
            report = ReportGeneration()
            doc = SimpleDocTemplate(target, pagesize=landscape(A3))
            height = doc.height
            width = doc.width
            # container for the 'Flowable' objects
            elements = []
            styleSheet = getSampleStyleSheet()
            P = report.Add_Title("NETRA")
            elements.append(P)
            elements.append(Spacer(width=0, height=0.25 * inch))
            elements.append(Spacer(width=0, height=0.25 * inch))
            elements.append(Spacer(width=0, height=0.25 * inch))
            elements.append(Spacer(width=0, height=0.25 * inch))

            header_text = "RCM ANALYSIS"
            table_data = [["SHIP NAME", "SYSTEM NAME"], [PLATFORM, SYSTEM]]

            elements.append(report.Add_Header_And_Table(header_text, table_data))
            elements.append(Spacer(width=0, height=0.25 * inch))
            elements.append(Spacer(width=0, height=0.15 * inch))

            # rcm_return_values = [['S.R.\nNo.', 'Component\nName', 'System\nName',
            #                       'Platform\nName', 'RCM\nSuggested']]
            rcm_return_values = [['No.', 'System',
                                'Platform', 'Component', 'RCM Plan']]
            # system_data = '''select component_name, ship_name, system, component_id from system_configuration where system=? and ship_name=? '''
            system_data = '''select s.component_id, s.component_name, r.rcm, s.parent_name, s.nomenclature, s.ship_name 
                from rcm_component as r right join system_configuration as s 
                on r.component_id = s.component_id where s.nomenclature=? and s.ship_name=?
            '''
            cursor.execute(system_data, SYSTEM, PLATFORM)        
            system_data = cursor.fetchall()

            for index,row in enumerate(system_data):
                if row[2] is None:
                    n = [index+1, row[4], row[5],row[1], "Please add Data"]
                else:
                    n = [index+1, row[4], row[5],row[1], row[2]]
                rcm_return_values.append(n)
            print(rcm_return_values)


            new_cell_height = 40  # Adjust this value as needed
            num_rows = len(rcm_return_values[0]) - 1
            row_heights = [new_cell_height]  * (num_rows + 1)
            row_heights[0] = new_cell_height * 2
            
            # system_data = report.get_system(SYSTEM, PLATFORM)
            t = Table(rcm_return_values, splitByRow=1, style=[
                ('BOX', (0, 0), (-1, -1), 1, colors.black),
                ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.gray),
                ('ALIGN', (0, 0), (-1, -1), 'CENTRE'),
                ('FONTSIZE', (0, 0), (-1, 0), 15),
                ('LEADING', (0, 0), (-1, 0), 30),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'), 
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ])
            
            # t._argW = 0.8 * height

            for col in range(len(t._colWidths)):
                if col == 3 or col == 4:
                    t._colWidths[col] = (2*width) / len(t._colWidths)
                elif col== 1 or col==2:
                    t._colWidths[col] = (0.6*width) / len(t._colWidths)
                else:
                    t._colWidths[col] = (0.3*width) / len(t._colWidths)

            elements.append(t)
            doc.build(elements)
            return self.success_return
        except Exception as e:
            print("An error occurred:", str(e))
            return self.error_return

