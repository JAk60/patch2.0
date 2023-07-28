from dB.dB_utility import check_table_exist
from dB.dB_connection import cursor, cnxn


class RCM_Tables():
    def __init__(self):
        """Initialize the class which creates phase_manager all tables 
        if they are not created."""
        self.initialize_tables()
        cnxn.commit()

    def initialize_tables(self):
        is_exist = check_table_exist('rcm_asm')
        if not is_exist:
            phase_sql = '''CREATE TABLE [dbo].[rcm_asm](
                            [id] [varchar](80) NOT NULL,
                            [equipment] [varchar](8000) NULL,
                            [platform] [varchar](8000) NULL,
                            [component] [varchar](8000) NULL,
                            [equipment_id] [varchar](8000) NULL,
                            [component_id] [varchar](8000) NULL,
                        CONSTRAINT [PK_rcm_asm] PRIMARY KEY CLUSTERED 
                        (
                            [id] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                        ) ON [PRIMARY]
                        GO

                        ALTER TABLE [dbo].[rcm_asm]  WITH CHECK ADD  CONSTRAINT [FK_rcm_asm_system_configuration] FOREIGN KEY([equipment_id])
                        REFERENCES [dbo].[system_configuration] ([component_id])
                        GO

                        ALTER TABLE [dbo].[rcm_asm] CHECK CONSTRAINT [FK_rcm_asm_system_configuration]
                        GO'''
            try:
                cursor.execute(phase_sql)
            except Exception as e:
                pass

        is_exist = check_table_exist('rcm_component')
        if not is_exist:
            rcm_component = '''CREATE TABLE [dbo].[rcm_component](
                        [component_id] [varchar](8000) NULL,
                        [component_name] [varchar](8000) NULL,
                        [rcm] [varchar](max) NULL,
                        [parrent_id] [varchar](max) NULL,
                        [parent_name] [varchar](8000) NULL,
                        [system] [varchar](8000) NULL,
                        [ship_name] [varchar](8000) NULL
                    )'''
            try:
                cursor.execute(rcm_component)
            except Exception as e:
                pass
