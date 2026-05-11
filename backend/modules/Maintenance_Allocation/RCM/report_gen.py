from reportlab.platypus import Paragraph, ListFlowable, ListItem, Table, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from datetime import datetime, timedelta
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import HorizontalBarChart, VerticalBarChart
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Table, TableStyle
import copy
styleSheet = getSampleStyleSheet()
# from databaseRelated.newAutoTables import  conn1, cursor
class ReportGeneration():
    def Add_Title(self, paraText):
        normalStyle = styleSheet['Heading1']
        normalStyle.fontSize = 32
        P = Paragraph('''
            <para align=center spaceb=3>{0}</para>'''.format(paraText),
                      style=normalStyle)
        return P
    
    def Add_Paragraph_Header(self, header_text):
        style = getSampleStyleSheet()["Normal"]
        # style.borderWidth = 1
        # style.borderPadding = 14
        # style.borderColor = 'black'
        # style.backColor = 'lightblue'
        P = Paragraph('''
                            <para size=18 alignment='center'>{0}</para>'''.format(header),
                    )
        return P

    def Add_Header_And_Table(self, header, data):
        # Create a Paragraph for the header
        header_para = Paragraph(header, style=getSampleStyleSheet()["Normal"])

        # Transpose the data to make it horizontal
        data_transposed = list(zip(*data))

        # Create a Table with as many columns as rows in the original data
        num_columns = len(data)
        new_cell_width = 100  # Adjust this value as needed
        col_widths = [new_cell_width] * num_columns
        col_widths[0] = new_cell_width * 2

        # Set custom heights for each row
        row_heights = [40] * len(data_transposed)  # Default height, adjust as needed
        # Set a specific height for the first row (header)
        row_heights[0] = 60  # Adjust the height as needed

        page_width, _ = A4

        # Define the style for the table
        style = [
            ('BACKGROUND', (0, 0), (0, -1), colors.lightblue),  # Color the first column
            ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('FONTSIZE', (0, 0), (0, -1), 18),
            ('BOTTOMPADDING', (0, 0), (0, -1), 12),
            ('BACKGROUND', (1, 0), (-1, -1), colors.white),  # Color the rest of the table
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (1, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]

        table = Table(data_transposed, splitByRow=1, style=style, colWidths=col_widths, rowHeights=row_heights)

        # Create a list of elements to be included in the final PDF

        return table
