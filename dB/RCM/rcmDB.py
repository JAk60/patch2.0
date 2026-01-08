from dB.dB_connection import cursor, cnxn
from uuid import uuid4
from dB.RCM.rcm_tables import RCM_Tables
import os
import time
import glob
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
            component = data["component"]
            rcm_val = data["rcm_val"]
            
            merge_sql = '''
                MERGE INTO rcm_component AS target
                USING (SELECT ? AS component_id, ? AS component_name, ? AS rcm, 
                            ? AS system, ? AS ship_name) AS source
                ON target.component_id = source.component_id
                WHEN MATCHED THEN
                    UPDATE SET 
                        component_name = source.component_name,
                        rcm = source.rcm,
                        system = source.system,
                        ship_name = source.ship_name
                WHEN NOT MATCHED THEN
                    INSERT (component_id, component_name, rcm, system, ship_name)
                    VALUES (source.component_id, source.component_name, source.rcm, 
                        source.system, source.ship_name);
            '''
            
            for comp in component:
                comp_id = comp["id"]
                comp_name = comp["name"]
                
                cursor.execute(merge_sql, (
                    comp_id, 
                    comp_name, 
                    rcm_val, 
                    system, 
                    ship_name
                ))
            
            cnxn.commit()
            return self.success_return
        except Exception as e:
            print(f"Error saving RCM: {str(e)}")
            cnxn.rollback()
            return self.error_return


    def generate_rcm_report(self, APP_ROOT, SYSTEM, PLATFORM):
        try:
            print("=" * 80)
            print("STARTING REPORT GENERATION")
            print(f"SYSTEM: {SYSTEM}")
            print(f"PLATFORM: {PLATFORM}")
            print("=" * 80)
            
            # First, AGGRESSIVELY clean up ALL old reports for this system/platform
            platform_clean = PLATFORM.replace(' ', '')
            system_clean = SYSTEM.replace(' ', '')
            
            # Remove old files with pattern matching (with and without timestamp)
            public_folder = os.path.join(APP_ROOT, 'frontend', 'public')
            
            # Create timestamp and filename FIRST
            timestamp = int(time.time())
            filename = f"{platform_clean}-{system_clean}-{timestamp}.pdf"
            target = os.path.join(public_folder, filename)
            
            print(f"\nPUBLIC FOLDER: {public_folder}")
            print(f"NEW FILENAME: {filename}")
            print(f"FULL TARGET PATH: {target}")
            print(f"TIMESTAMP: {timestamp}")
            
            print("\n--- CLEANUP PHASE ---")
            # Pattern 1: Old files without timestamp
            old_filename_no_timestamp = f"{platform_clean}-{system_clean}.pdf"
            old_path_no_timestamp = os.path.join(public_folder, old_filename_no_timestamp)
            print(f"Checking for old file (no timestamp): {old_path_no_timestamp}")
            if os.path.isfile(old_path_no_timestamp):
                os.remove(old_path_no_timestamp)
                print(f"✓ Removed old report (no timestamp): {old_path_no_timestamp}")
            else:
                print(f"✗ File not found (no timestamp)")
            
            # Pattern 2: Old files with timestamp (but not the one we're creating)
            old_pattern = os.path.join(public_folder, f"{platform_clean}-{system_clean}-*.pdf")
            print(f"\nSearching for old timestamped files: {old_pattern}")
            old_files = glob.glob(old_pattern)
            print(f"Found {len(old_files)} timestamped files")
            
            for old_file in old_files:
                if old_file != target:  # Don't delete the one we're about to create
                    try:
                        os.remove(old_file)
                        print(f"✓ Removed old report: {old_file}")
                    except Exception as e:
                        print(f"✗ Could not remove old file {old_file}: {str(e)}")
                else:
                    print(f"⊙ Skipping target file: {old_file}")
            
            # Double check - if file somehow exists, remove it
            print(f"\nDouble-checking if target exists: {target}")
            if os.path.isfile(target):
                os.remove(target)
                print(f"✓ Removed existing target: {target}")
            else:
                print(f"✓ Target doesn't exist (good)")
            
            print("\n--- FILES IN PUBLIC FOLDER AFTER CLEANUP ---")
            pdf_files = [f for f in os.listdir(public_folder) if f.endswith('.pdf')]
            if pdf_files:
                for f in pdf_files:
                    print(f"  - {f}")
            else:
                print("  (No PDF files)")
            
            print("\n--- GENERATING NEW REPORT ---")
            
            # Generate the report
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

            rcm_return_values = [['No.', 'System',
                                'Platform', 'Component', 'RCM Plan']]
            
            system_data_ = '''select s.component_id, s.component_name, r.rcm, s.parent_name, s.nomenclature, s.ship_name 
                from rcm_component as r right join system_configuration as s 
                on r.component_id = s.component_id where s.nomenclature=? and s.ship_name=?
            '''
            cursor.execute(system_data_, SYSTEM, PLATFORM)        
            parent_id_ = cursor.fetchone()[0]

            system_data = '''select s.component_id, s.component_name, r.rcm, s.parent_name, s.nomenclature, s.ship_name 
                from rcm_component as r right join system_configuration as s 
                on r.component_id = s.component_id where s.ship_name=? and s.parent_id=?
            '''
            cursor.execute(system_data, PLATFORM, parent_id_)
            system_data = cursor.fetchall()

            for index, row in enumerate(system_data):
                if row[2] is None:
                    n = [index+1, row[4], row[5], row[1], "Please add Data"]
                else:
                    n = [index+1, row[4], row[5], row[1], row[2]]
                rcm_return_values.append(n)
            print(rcm_return_values)

            new_cell_height = 40
            num_rows = len(rcm_return_values[0]) - 1
            row_heights = [new_cell_height] * (num_rows + 1)
            row_heights[0] = new_cell_height * 2
            
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

            for col in range(len(t._colWidths)):
                if col == 3 or col == 4:
                    t._colWidths[col] = (2*width) / len(t._colWidths)
                elif col == 1 or col == 2:
                    t._colWidths[col] = (0.6*width) / len(t._colWidths)
                else:
                    t._colWidths[col] = (0.3*width) / len(t._colWidths)

            elements.append(t)
            doc.build(elements)
            
            print("\n--- REPORT GENERATION COMPLETE ---")
            print(f"✓ PDF created successfully: {filename}")
            print(f"✓ File location: {target}")
            print(f"✓ File exists: {os.path.isfile(target)}")
            if os.path.isfile(target):
                file_size = os.path.getsize(target)
                print(f"✓ File size: {file_size} bytes ({file_size/1024:.2f} KB)")
            
            print("\n--- FINAL FILES IN PUBLIC FOLDER ---")
            pdf_files = [f for f in os.listdir(public_folder) if f.endswith('.pdf')]
            if pdf_files:
                for f in pdf_files:
                    full_path = os.path.join(public_folder, f)
                    size = os.path.getsize(full_path)
                    print(f"  - {f} ({size/1024:.2f} KB)")
            else:
                print("  (No PDF files)")
            
            print("=" * 80)
            
            # Return success with the filename
            return {
                "message": "Data Saved Successfully.",
                "code": 1,
                "filename": filename
            }
        except Exception as e:
            print("\n" + "!" * 80)
            print(f"ERROR OCCURRED: {str(e)}")
            print("!" * 80)
            import traceback
            traceback.print_exc()
            return self.error_return