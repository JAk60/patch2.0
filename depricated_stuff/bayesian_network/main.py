from con_mon_phase_four import Condition_monitoring2
from baseyianNetwork import BayesianNetwork
from finalPhaseList import FinalPhase

# curr_age = 300  # hours in current stage
# current_temp_val = 15
# projected_days = 300
# projected_duration_hours = projected_days*24
# num_of_phases = 4
# con_inst = Condition_monitoring2()
# final_phase_inst = FinalPhase()
# # totalReliability, phaseReliabilityList = con_inst.condition_monitoring(curr_age, current_temp_val, projected_duration_hours)

# totalReliability, phaseReliabilityList = final_phase_inst.final_phase_condition_monitoring(curr_age,
#                                                                                            current_temp_val, projected_duration_hours, num_of_phases)


# def get_phase_relib(curr_age, current_temp_val, projected_duration_hours, num_of_phases):
#     totalReliability, phaseReliabilityList = final_phase_inst.final_phase_condition_monitoring(curr_age,
#                                                                                                current_temp_val, projected_duration_hours, num_of_phases)
#     return totalReliability, phaseReliabilityList


# proj_prob = []
# if len(phaseReliabilityList) == 4:
#     proj_prob = phaseReliabilityList
# elif len(phaseReliabilityList) == 3:
#     proj_prob = [0] + phaseReliabilityList
# elif len(phaseReliabilityList) == 2:
#     proj_prob = [0, 0] + phaseReliabilityList
# else:
#     proj_prob = [0, 0, 0] + phaseReliabilityList


# bn_inst = BayesianNetwork()
# print("Current health probabilities:")
# bn_inst.estimate([0.1, 0.3, 0.6, 0])
# print("=============")
# # print("----------")
# print("Projected Probabilities:")
# print(proj_prob)
# print("Projected health probabilities:")
# bn_inst.estimate(proj_prob)
# print("Hello")

# write bayesian networ code


class Bayesian_Network:
    def __int__(self):
        self.curr_age = 300  # hours in current stage
        self.current_temp_val = 15
        self.projected_days = 300
        self.projected_duration_hours = self.projected_days*24
        self.num_of_phases = 4
        # self.con_inst = Condition_monitoring2()
        # self.final_phase_inst = FinalPhase()

    def get_phase_relib(self, curr_age, current_temp_val, projected_duration_hours, num_of_phases):
        final_phase_inst = FinalPhase()
        totalReliability, phaseReliabilityList = final_phase_inst.final_phase_condition_monitoring(curr_age,
                                                                                                   current_temp_val, projected_duration_hours, num_of_phases)
        return totalReliability, phaseReliabilityList

    def estimate(self):
        proj_prob = []
        totalReliability, phaseReliabilityList = self.get_phase_relib(
            self.curr_age, self.current_temp_val, self.projected_duration_hours, self.num_of_phases)
        if len(phaseReliabilityList) == 4:
            proj_prob = phaseReliabilityList
        elif len(phaseReliabilityList) == 3:
            proj_prob = [0] + phaseReliabilityList
        elif len(phaseReliabilityList) == 2:
            proj_prob = [0, 0] + phaseReliabilityList
        else:
            proj_prob = [0, 0, 0] + phaseReliabilityList

        bn_inst = BayesianNetwork()
        print("Current health probabilities:")
        bn_inst.estimate([0.1, 0.3, 0.6, 0])
        print("=============")
        # print("----------")
        print("Projected Probabilities:")
        print(proj_prob)
        print("Projected health probabilities:")
        bn_inst.estimate(proj_prob)

bn = Bayesian_Network()
bn.estimate()
