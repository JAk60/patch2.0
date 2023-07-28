from dB.dB_connection import cursor, cnxn
from dB.hep.hepdB_table import hepdB_Table

from uuid import uuid4


class Hep_dB():
    def __init__(self):
        hepdB_Table()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}

    def save_dataToDB(self, data, dtype):
        res = ''
        if dtype == 'insertHEP':
            res = self.insert_hep(data)
        if dtype == 'insertComponentLevel':
            res = self.insert_component_level(data)
        if dtype == 'insertExtFactors':
            res = self.insert_ext_factors(data)
        if dtype == 'insertLifeMultiplier':
            res = self.insert_life_multiplier(data)
        return res

    def insert_hep(self, data):
        #print(data)
        try:
            for d in data:
                component_id = d['ComponentId']
                id = d['id']
                phase_name = d['phase']
                maintenance_policy = d['Maintenancepolicy']
                AT_N =d['ATNominal']
                AT_LTR =d['Lessthanrequired']
                AT_HTR =d['Higherthanrequired']
                AT_VHTR =d['vhtr']
                stress_N =d['Nominal']
                stress_L =d['Low']
                stress_E =d['Extreme']
                insert_hep = '''INSERT INTO hep_equipment_level (id, component_id, phase_name,
                               maintenance_policy,AT_N,AT_LTR,AT_HTR,AT_VHTR,stress_N,stress_L,stress_E)
                                        VALUES (?, ?, ?, ?, ?, ?, ?,?, ?,?,?);'''

                cursor.execute(insert_hep, id, component_id, phase_name,
                               maintenance_policy, AT_N,AT_LTR,AT_HTR,AT_VHTR,stress_N,stress_L,stress_E)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def insert_component_level(self,data):
        #print(data)
        try:
            for d in data:
                id=d['id']
                component_id =d['ComponentId']
                complexity =d['psfcomplexity']
                ergonomics =d['psfergonomics']
                procedure_available =d['psfprocedure']
                insert_component_level = '''INSERT INTO hep_component_level (id, component_id,
                            complexity,ergonomics,procedure_available)
                                        VALUES (?, ?, ?, ?, ?);'''

                cursor.execute(insert_component_level, id, component_id,
                            complexity,ergonomics,procedure_available)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return
    
    def insert_ext_factors(self,data):
        #print(data)
        try:
            for d in data:
                id=d['id']
                component_id =d['ComponentId']
                exp_low =d['expLow']
                exp_nominal =d['expNominal']
                exp_high =d['expHigh']
                work_culture =d['workCulture']
                fit_low =d['fitLow']
                fit_nominal =d['fitNominal']
                fit_high =d['fitHigh']
                
                insert_ext_factors = '''INSERT INTO hep_ext_factors (id, component_id,
                            exp_low,exp_nominal,exp_high,work_culture,fit_low,fit_nominal,fit_high) VALUES (?, ?, ?, ?, ?,?,?,?,?);'''

                cursor.execute(insert_ext_factors, id, component_id,
                            exp_low,exp_nominal,exp_high,work_culture,fit_low,fit_nominal,fit_high)
                cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def insert_life_multiplier(self,data):
        #print(data)
        try:
            for d in data:
                id=d['id']
                component_id =d['ComponentId']
                refurbished =d['refurbished']
                cannibalised =d['cannibalised']
                non_oem =d['nonOEM']
                insert_component_level = '''INSERT INTO hep_life_multiplier (id, component_id,
                            refurbished,cannibalised,non_oem)
                                        VALUES (?, ?, ?, ?, ?);'''

                cursor.execute(insert_component_level, id, component_id,
                            refurbished,cannibalised,non_oem)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

