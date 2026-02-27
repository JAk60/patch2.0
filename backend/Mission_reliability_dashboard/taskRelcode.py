import copy
import numpy as np
import pandas as pd
import math

class TaskRelCode:
    def __init__(self):
        pass
    
    def equipment_reliability(self, alpha, bta, t, D):
        NT1 = alpha * (t ** bta)
        NT2 = alpha * ((t+D) ** bta)
        NT = NT2 -NT1
        FR = NT/D
        rel = math.e ** (-FR * D)
        return (rel, FR)

    def top_equipment_in_group(self, group_equip, group_alpha, group_bta, group_t, D, k,n):
        group_equi_rel = []
        max_rel_equip = []
        max_rel_equip_index = []
        group_FR = []
        for i in range(n):
            equip_rel, FR = self.equipment_reliability(group_alpha[i], group_bta[i], group_t[i], D)
            group_equi_rel.append(equip_rel)
            group_FR.append(FR)
        group_equi_rel_copy = copy.deepcopy(group_equi_rel)

        for j in range(k) :
            max_rel_equip.append(max(group_equi_rel_copy))
            max_rel_equip_index.append(group_equi_rel.index(max(group_equi_rel_copy)))
            group_equi_rel_copy.remove(max(group_equi_rel_copy))
        return (max_rel_equip, max_rel_equip_index, group_equi_rel, group_FR )

    
    def group_rel(self, group_equip, group_alpha, group_bta, group_t, D, k, n):
        max_rel_equip, max_rel_equip_index, group_equi_rel, FR = self.top_equipment_in_group(group_equip, group_alpha, group_bta, group_t, D, k,n)
        if (k<n):
            FR_sum = 0
            not_max_equip_index = []
            for j in range(n):
                if j not in max_rel_equip_index:
                    not_max_equip_index.append(j)
            for i in max_rel_equip_index:
                FR_sum += FR[i]
            lamda_max = FR_sum/k

            Rel = (math.e ** -(k * lamda_max * D)) * sum((((k * lamda_max * D) ** i) / math.factorial(i)) for i in range(len(not_max_equip_index)))
        else:
            Rel = 1
            for i in group_equi_rel:
                Rel = Rel * i
        return (group_equi_rel , max_rel_equip , [group_equip[i] for i in max_rel_equip_index], Rel, max_rel_equip_index)