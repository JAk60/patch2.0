from reportlab.platypus import Paragraph, ListFlowable, ListItem, Table, Image
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime, timedelta
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import HorizontalBarChart, VerticalBarChart
from reportlab.lib import colors
import copy
styleSheet = getSampleStyleSheet()
# from databaseRelated.newAutoTables import  conn1, cursor
class ReportGeneration():
    def Add_Title(self, paraText):
        normalStyle = styleSheet['Normal']
        normalStyle.fontSize = 32
        P = Paragraph('''
            <para align=center spaceb=3 fontSize=32>{0}</para>'''.format(paraText),
                      style=normalStyle)
        return P
    
    def Add_Paragraph_Header(self, header):
        style = getSampleStyleSheet()["Normal"]
        style.borderWidth = 1
        style.borderPadding = 14
        style.borderColor = 'black'
        style.backColor = 'lightblue'
        P = Paragraph('''
                            <para  color='blue' spaceb=3 spaceAfter=3
                            borderWidth=1 size=18 alignment='center'><u>{0}</u></para>'''.format(header),
                      style=style)
        return P