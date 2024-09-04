import numpy as np
import matplotlib.pyplot as plt
from finalPhaseList import FinalPhase
final_phase_inst = FinalPhase()
T_all = np.linspace(0, 100, 10)
print(T_all)
num_of_phases = 4
cal90 = []
cal10 = []
for temp in T_all:
    d = 10
    R = 1
    while R > 0.1:
        # find Rel
        R, phaseReliabilityList = final_phase_inst.final_phase_condition_monitoring(300,
                                                                                    temp, d, num_of_phases)
        print(R)
        d = d+10000
        if R < 0.9:
            tcal90 = d


# curr_age = 300  # hours in current stage
# current_temp_val = 15
# projected_days = 20
# projected_duration_hours = projected_days*24
# num_of_phases = 4
# con_inst = Condition_monitoring2()
# final_phase_inst = FinalPhase()
# # totalReliability, phaseReliabilityList = con_inst.condition_monitoring(curr_age, current_temp_val, projected_duration_hours)


# # def get_phase_relib(curr_age, current_temp_val, projected_duration_hours, num_of_phases):
# #     totalReliability, phaseReliabilityList = final_phase_inst.final_phase_condition_monitoring(curr_age,
# #                                                                                                current_temp_val, projected_duration_hours, num_of_phases)
# #     return totalReliability, phaseReliabilityList
# cal90 = []
# cal10 = []
# T_all = np.linspace(0, 2000, 10)
# for T1 in T_all:
#     print("age is " + str(T1))
#     d = 100
#     R = 1
#     # print(T1)
#     fall = False
#     while(R > 0.1):
#         k = 1
#         totalReliability, phaseReliabilityList = final_phase_inst.final_phase_condition_monitoring(d,
#                                                                                                    current_temp_val, projected_duration_hours, num_of_phases)

#         d = d+100
#         if R < 0.9:
#             # print(phase)
#             # print(d)
#             fall = True
#             tcal90 = d
#         # d=d+500*k
#         m = d
#         k = k-0.02
#     cal10.append(d)
#     cal90.append(tcal90)
# plt.figure()
# #plt.plot(T_all,act_t90,label="90% reliability actual time")
# plt.plot(T_all, cal90, label="90% reliability calculated time")
# #plt.plot(T_all,act_t10,label="10% reliability actual time")
# plt.plot(T_all, cal10, label="10% reliability calcualted time")
# # p1 = [0, p3_end]
# # p2 = [p3_end, 0]
# # plt.plot(p1, p2)
# plt.ylabel("RUL")
# plt.xlabel("Aged life")
# plt.legend()
# plt.show()

# # print(d)
# # k=1
# # if T1 > p3_end:
# #     #t1_new =T1-p3_end
# #     t1_new=T1-p3_end
# #    # print("current state is sev deto")
# #     eta3=max(0.1*3355,-1.43*t1_new+3376)
# #     #eta3=max(0.1*3355,0.000225*t1_new**2-1.95*t1_new+3514)
# #     R= cond_relia(eta4,beta4,d,t1_new)
# #     #print("reliability is "+ str(R))
# #     phase="fdeto"
# #     d=d+100
# # elif T1 > p2_end:
# #     #t1_new =T1-p2_end
# #     t1_new=T1-p2_end
# #    # print("current state is sev deto")
# #     eta3=max(0.1*3355,-1.43*t1_new+3376)
# #     #eta3=max(0.1*3355,0.000225*t1_new**2-1.95*t1_new+3514)
# #     R= reli_part_deto(eta3,t1_new,beta3,eta4,beta4,d,d)
# #     #print("reliability is "+ str(R))
# #     phase="deto"
# #     d=d+100
# # elif T1> p1_end:
# #     #t1_new =T1-p1_end
# #     t1_new=T1-p1_end
# #     eta2=max(0.1*4832,-2.059*t1_new+4783)
# #     #eta2=max(0.1*4832,0.000131*t1_new**2-2.34*t1_new+4975)

# #    # print("Current phase is partialy detoriated")
# #     R=reli_healthy(beta2,eta2,t1_new,beta3,eta3,beta4,eta4,d)
# #     phase="partial"
# #     #print("reliability is " + str(R))
# #     d=d+100
# # else:
# #     #eta1=max(3701*0.1,-1.61*d+3838)
# #     #eta1=max(0.1*3355,0.000377*t1_new**2-2.44*t1_new+3883)

# #     R=reli_fresh(d,T1,eta1,beta1,eta2,beta2,eta3,beta3,eta4,beta4)
# #     phase="healthy"
# #     print("Current phase is Healthy")
# #     d=d+100
# #     print("reliability is " + str(R))
