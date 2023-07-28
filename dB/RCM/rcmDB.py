from dB.dB_connection import cursor, cnxn
from uuid import uuid4
from dB.RCM.rcm_tables import RCM_Tables
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import  inch, A3
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
            system = data["system"]
            ship_name = data["ship_name"]
            insert_sql = '''insert into rcm_asm values(?,?,?,?,?,?)'''
            data = data["asm_data"]
            if len(data) > 0:
                parent_id = data[0]["parentId"]
                self.delete_asm(parent_id)
            for f in data:
                parent_id = f["parentId"]
                name = f["name"]
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
        select_sql = '''select * from rcm_asm where equipment = ? and platform = ?'''
        eq = data["system"]
        platform = data["ship_name"]
        cursor.execute(select_sql, eq, platform)
        asm_d = cursor.fetchall()
        mData = []
        for d in asm_d:
            mData.append({"id": d[0], "parentName": d[1], "platform": d[2], "name": d[3],
                          "equipment_id": d[4], "component_id": d[5]}) 
        return mData


    def save_component_rcm(self, data):
        print("Hello")
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
                cursor.update(update_sql, rcm_val, comp_id)
            else:
                cursor.execute(insert_sql, comp_id, comp_name, rcm_val, parent_id, parent_name, system, ship_name)
        cnxn.commit()
        return self.success_return



    def generate_rcm_report(self, APP_ROOT, SYSTEM, PLATFORM):
        target = os.path.join(APP_ROOT, 'netra\public\{0}-{1}.pdf'.format(PLATFORM.replace(' ',''), SYSTEM.replace(' ','')))
        if os.path.isfile(target):
            os.remove(target)
        report = ReportGeneration()
        doc = SimpleDocTemplate(target, pagesize=A3)
        height = doc.height
        width = doc.width
        # container for the 'Flowable' objects
        elements = []
        styleSheet = getSampleStyleSheet()
        P = report.Add_Title("NETRA")
        elements.append(P)
        elements.append(Spacer(width=0, height=0.25 * inch))
        elements.append(Spacer(width=0, height=0.15 * inch))
        elements.append(Spacer(width=0, height=0.15 * inch))
        elements.append(Spacer(width=0, height=0.15 * inch))

        elements.append(report.Add_Paragraph_Header('System RCM details for Ship {0} and System {1}'.format(PLATFORM, SYSTEM)))
        elements.append(Spacer(width=0, height=0.25 * inch))
        elements.append(Spacer(width=0, height=0.15 * inch))
        

        # rcm_return_values = [['S.R.\nNo.', 'Component\nName', 'System\nName',
        #                       'Platform\nName', 'RCM\nSuggested']]
        rcm_return_values = [['S.R.\nNo.', 'System\nName',
                              'Platform\nName', 'Component\nName', 'RCM Plan']]
        # system_data = '''select component_name, ship_name, system, component_id from system_configuration where system=? and ship_name=? '''
        system_data = '''select s.component_id, s.component_name, r.rcm, s.parent_name, s.system, s.ship_name 
        from rcm_component as r right join system_configuration as s 
        on r.component_id = s.component_id where s.system=? and s.ship_name=?'''
        cursor.execute(system_data, SYSTEM, PLATFORM)        
        system_data = cursor.fetchall()

        for index,row in enumerate(system_data):
            if row[2] is None:
                n = [index+1, row[4], row[5],row[1], "Please add Data!!"]
            else:
                n = [index+1, row[4], row[5],row[1], row[2]]
            rcm_return_values.append(n)
        
        # system_data = report.get_system(SYSTEM, PLATFORM)
        t = Table(rcm_return_values, splitByRow=1, style=[
            ('LINEABOVE', (0, 0), (-1, 0), 1.5, colors.blue),
            ('LINEBELOW', (0, -1), (-1, -1), 1.5, colors.blue),
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.gray),
            ('ALIGN', (0, 0), (-1, -1), 'CENTRE'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('LEADING', (0, 0), (-1, 0), 30),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue)
        ])
        # t._argW = 0.8 * height
        for col in range(len(t._colWidths)):
            if col == 3 or col == 4:
                t._colWidths[col] = (2*width) / len(t._colWidths)
            else:
                t._colWidths[col] = (0.4*width) / len(t._colWidths)
        elements.append(t)

        try:
            doc.build(elements)
            return self.success_return
        except:
            return self.error_return

