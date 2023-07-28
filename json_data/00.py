{
    "component_id": "c88aa68a-c924-11eb-b8bc-0242ac130003",
    "component_name": "DA",
    "parent_name": "Talwar",
    "part_code": "kta50dm",
    "is_lmu": 0
}
# "level1": null,
# "level0": "talwar",
# 0 not lmu


class System_ConfigurationN(System_Configuration):
    def __init__(self, data):
        super().__init__(data)
        self.data = data
        for i in data:
            self.component_id = i.component_id
            self.component_name = i.component_name
            self.save_to_db(**data)


# System Config Super class with all properties.
# Inherit System Config to System_Config_Netra
## component = System_Config_Netra(i)
# pass this component to another function which saves the data.
# Database file has method which "save_component()" -- this gets the object with has all the
# attributes, just save the data.
# Why?? Why??
# This is because if we add new property to super class there is no need to make
# any changes to Netra class and then there is no need to make any changes in
# netra database class.
# also we can keep generic names in Super class and then change them in inherited classes
# and that can be used for better readibility in specific applications.
for i in data:
    component_i = System_ConfigurationN(i)
    db.save_component(component)
