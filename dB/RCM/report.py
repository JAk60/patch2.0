# from reportlab.platypus import Paragraph, ListFlowable, ListItem, Table, Image
# from reportlab.lib.styles import getSampleStyleSheet
# from datetime import datetime, timedelta
# from reportlab.graphics.shapes import Drawing
# from reportlab.graphics.charts.barcharts import HorizontalBarChart, VerticalBarChart
# from reportlab.lib import colors
# import copy
# styleSheet = getSampleStyleSheet()
# # from databaseRelated.newAutoTables import  conn1, cursor
# class ReportGeneration():
#     def Add_Title(self, paraText):
#         normalStyle = styleSheet['Normal']
#         normalStyle.fontSize = 32
#         P = Paragraph('''
#             <para align=center spaceb=3 fontSize=32>{0}</para>'''.format(paraText),
#                       style=normalStyle)
#         return P

#     def Add_Paragraph(self, paraText, headerText='', width=1, multiFactor=1):
#         """Add Paragraph dynamically!!"""
#         style = getSampleStyleSheet()["Normal"]
#         # style.borderWidth = 1
#         # style.borderPadding = 14
#         # style.borderColor = 'black'
#         # style.backColor = 'lightblue'
#         style1 = getSampleStyleSheet()["Normal"]
#         tbl_data = [[Paragraph('''
#                     <para fontSize=18 Color='blue' alignment='center'><u>{0}</u></para>'''.format(headerText), style=style)],
#                     [Paragraph('''
#                     <para spaceb=3 fontSize=14 textColor='black' alignment='center'>{0}</para>'''.format(paraText), style=style1)]]
#         tbl = Table(tbl_data, style=[
#             ('LINEABOVE', (0, 0), (-1, 0), 1.5, colors.blue),
#             ('LINEBELOW', (0, -1), (-1, -1), 1.5, colors.blue),
#             ('BOX', (0, 0), (-1, -1), 1, colors.black),
#             ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.gray),
#             ('ALIGN', (0, 0), (-1, 0), 'CENTRE'),
#             ('FONTSIZE', (0, 0), (-1, 0), 18),
#             ('FONTSIZE', (0, 1), (-1, -1), 14),
#             ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
#             ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
#             ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
#         ])
#         for col in range(len(tbl._rowHeights)):
#             tbl._rowHeights[col] = (multiFactor * width) / len(tbl._rowHeights)
#         return tbl
#     def Add_Paragraph_Header(self, header):
#         style = getSampleStyleSheet()["Normal"]
#         style.borderWidth = 1
#         style.borderPadding = 14
#         style.borderColor = 'black'
#         style.backColor = 'lightblue'
#         P = Paragraph('''
#                             <para  color='blue' spaceb=3 spaceAfter=3
#                             borderWidth=1 size=18 alignment='center'><u>{0}</u></para>'''.format(header),
#                       style=style)
#         return P
#     def Add_Ordered_List(self, text):
#         style = styleSheet['Normal']
#         style.fontSize = 14
#         style.leading = 16
#         listItems = [ListItem(Paragraph(l, style=style)) for l in text]

#         P = ListFlowable(
#             listItems
#         )
#         return P

#     def get_latest_operational_data(self, system, platform):
#         sql = """select COUNT(*) from data_operational where system=? and platform=?"""
#         cursor.execute(sql, system, platform)
#         opr_data = cursor.fetchone()
#         return opr_data[0]

#     def get_latest_maint_data(self, system, platform):
#         sql = '''select count(*) from data_maintenance_final where system=? and platform=?'''
#         cursor.execute(sql, system, platform)
#         maint_data = cursor.fetchone()
#         return maint_data[0]

#     def get_system(self, system, platform):
#         system_return_data = [[],['Platform Name:  {0}'.format(platform), 'System Name:  {0}'.format(system)]]
#         sql = '''select COUNT(name) from system_configuration where system_name=? and platform_name=? and parent_unit=?'''
#         cursor.execute(sql, system, platform, system)
#         system_sql_data = cursor.fetchone()
#         subSystemNumber = 'Number of Sub System: {0}'.format(system_sql_data[0])
#         sql = '''select COUNT(name) from system_configuration where system_name=? and platform_name=? and is_lmu=1'''
#         cursor.execute(sql, system, platform)
#         system_sql_data = cursor.fetchone()
#         lmuNumber = 'Number of Lowest Maintainable Units: {0}'.format(system_sql_data[0])
#         system_return_data.append([subSystemNumber, lmuNumber])
#         system_return_data.append([])
#         return system_return_data

#     def get_phase_data(self, system,platform):
#         phase_return_value = [['Phase\nName', 'Measurement\nType', 'Quantitative\nName',
#                               'Qualitative\nRange Name', 'Lower\nBound', 'Upper\nBound']]
#         sql = '''select phase_name, measurement_type,A_value, phase_range,lower_bound, upper_bound from phase_parameter
#                   where system_name=? and platform_name=?'''
#         cursor.execute(sql, system, platform)
#         phase_sql_data = cursor.fetchall()
#         phase_data = [[str(y) for y in x] for x in phase_sql_data]
#         for phase in phase_data:
#             if phase[1] == 'Qual':
#                 phase[1] = 'Qualitative'
#             else:
#                 phase[1] = 'Quantative'
#         phase_return_value += phase_data
#         return phase_return_value

#     def get_eta_beta(self, system, platform):
#         '''Get Latest Eta beta from Eta beta param estimation'''
#         sql = '''select lmu, eta, beta from eta_beta_parameter_esti where system=? and platform=?'''
#         cursor.execute(sql, system, platform)
#         eta_data = cursor.fetchall()
#         eta_beta_return_value = [['LMU', 'Eta', 'Beta']]
#         eta_data = [[str(y) for y in x] for x in eta_data]
#         eta_beta_return_value += eta_data
#         return eta_beta_return_value

#     def get_mission_profile(self, system, platform):
#         '''Get all mission profile'''
#         sql = '''select mission_name, Stage_name, load, duration, target_rel from mission_profile WHERE system=? and platform=?'''
#         mission_return_data = [['Mission\nName', 'Stage\nName', 'Phase\nName', 'Duration', 'Target\nReliability']]
#         cursor.execute(sql, system, platform)
#         mission_data = cursor.fetchall()
#         for x in mission_data:
#             phases = x[2].split('|')
#             for phase in phases:
#                 mission_return_data.append([str(x[0]), str(x[1]), str(phase), str(x[3]), str(x[4])])
#         return mission_return_data
#     # Add Eta Beta Paragraph
#     def Add_Paragraph_Eta_Beta(self, width=1):
#         """Add Paragraph dynamically!!"""
#         style = getSampleStyleSheet()["Normal"]
#         # style.borderWidth = 1
#         # style.borderPadding = 14
#         # style.borderColor = 'black'
#         # style.backColor = 'lightblue'
#         style1 = getSampleStyleSheet()["Normal"]
#         style1.textColor = 'black'
#         tedata = [[Paragraph('''<para Size=18 alignment='center' Color='blue'>Eta Beta Formulas Used</para>''', style=style)],
#                   [Paragraph('''<para Size=14 alignment='center'><u>Life in terms of two life estimates.</u></para>''', style=style1)],
#                   [Image('static/img/equations/two_life.JPG')],
#                   [Paragraph(
#                       '''<para Size=14 alignment='center'><u>OEM Estimates and Expert Judgement</u></para>''',
#                       style=style1)],
#                   [Image('static/img/equations/oem.JPG')],
#                   [Paragraph(
#                       '''<para Size=14 alignment='center'><u>The most likely life of the component stated by expert suggests the mode value of the time to failure distribution. The equation generated by this information is shown here</u></para>''',
#                       style=style1)],
#                   [Image('static/img/equations/t_mode.JPG')],
#                   [Paragraph(
#                       '''<para Size=14 alignment='center'><u>The minimum life observed of component stated by the expert along with the number
#          of failures seen by the individual expert leads to the usage of zero failure test where the reliability of that component
#          can be estimated using the number of failures seen by the individual expert and the confidence level.
#          The equation for estimating the zero failure reliability is shown here.</u></para>''',
#                       style=style1)],
#                   [Image('static/img/equations/confidence.JPG')]
#                   ]
#         tbl = Table(tedata, style=[
#             ('LINEABOVE', (0, 0), (-1, 0), 1.5, colors.blue),
#             ('LINEBELOW', (0, -1), (-1, -1), 1.5, colors.blue),
#             ('BOX', (0, 0), (-1, -1), 1, colors.black),
#             ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.gray),
#             ('ALIGN', (0, 0), (-1, -1), 'CENTRE'),
#             ('FONTSIZE', (0, 0), (-1, 0), 18),
#             ('FONTSIZE', (0, 1), (-1, -1), 14),
#             ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
#             ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
#             ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
#         ])
#         for col in range(len(tbl._rowHeights)):
#             tbl._rowHeights[col] = (width) / len(tbl._rowHeights)
#         return tbl

#     def Add_Paragraph_Reliability(self, width=1):
#         """Add Paragraph dynamically!!"""
#         style = getSampleStyleSheet()["Normal"]
#         # style.borderWidth = 1
#         # style.borderPadding = 14
#         # style.borderColor = 'black'
#         # style.backColor = 'lightblue'
#         style1 = getSampleStyleSheet()["Normal"]
#         style1.textColor = 'black'
#         tedata = [[Paragraph('''<para Size=18 alignment='center' Color='blue'>Reliability Calculation</para>''', style=style)],
#                   [Image('static/img/equations/reli.JPG')]
#                   ]
#         tbl = Table(tedata, style=[
#             ('LINEABOVE', (0, 0), (-1, 0), 1.5, colors.blue),
#             ('LINEBELOW', (0, -1), (-1, -1), 1.5, colors.blue),
#             ('BOX', (0, 0), (-1, -1), 1, colors.black),
#             ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.gray),
#             ('ALIGN', (0, 0), (-1, -1), 'CENTRE'),
#             ('FONTSIZE', (0, 0), (-1, 0), 18),
#             ('FONTSIZE', (0, 1), (-1, -1), 14),
#             ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
#             ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
#             ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
#         ])
#         for col in range(len(tbl._rowHeights)):
#             if col == 0:
#                 tbl._rowHeights[col] = (0.2*width) / len(tbl._rowHeights)
#             else:
#                 tbl._rowHeights[col] = (0.6 * width) / len(tbl._rowHeights)
#         return tbl

#     ## Graph Bar.
#     def draw_bar_trial(self, relData, mission, width=1):
#         drawing = Drawing(400,200)
#         data = [
#             relData
#         ]
#         bc = HorizontalBarChart()
#         bc.x = 50
#         bc.y = 50
#         bc.height = 125
#         bc.width = 0.9*width
#         bc.data = data
#         bc.strokeColor = colors.black
#         bc.strokeWidth = 2
#         bc.bars[(0,0)].fillColor = colors.lightblue
#         bc.bars[(0, 1)].fillColor = colors.lightblue
#         bc.valueAxis.valueMin = 0
#         bc.valueAxis.valueMax = 100
#         bc.valueAxis._valueStep = 5
#         bc.categoryAxis.labels.boxAnchor = 'ne'
#         bc.categoryAxis.labels.dx = 2
#         bc.categoryAxis.labels.dy = -2
#         bc.categoryAxis.labels.angle = 30
#         bc.categoryAxis.categoryNames = ['Actual Reliability', 'Target Reliability']
#         drawing.add(bc)
#         return drawing
