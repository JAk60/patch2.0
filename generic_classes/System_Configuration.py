class System_Configuration:
    def __init__(self, component):
        self.component_id = component.component_id
        self.component_name = component.component_name
        self.is_lmu = component.is_lmu
        self.parent_name = component.parent_name
        self.part_code = component.part_code
