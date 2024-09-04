
import numpy as np
from databaseRelated.newAutoTables import conn1, cursor


class Ml_train:
    def estimation(self, data, threshold_data):
        output = np.empty(2)
        data.dropna(inplace=True)

        def weibull_rankreg(time):

            total = len(time)
            time = np.sort(time)
            F = np.empty(total)
            x = np.empty(total)
            y = np.empty(total)
            q = np.empty(total)
            x_sq = np.empty(total)

            for i in range(0, total):
                F[i] = (i + 1 - 0.3) / (total + 0.4)

                x[i] = float(np.log10(time[i]) / 0.434)
                l = F[i]
                cd = (1 / (1 - l))
                d = np.log10(cd) / 0.434
                y[i] = float(np.log10(d) / 0.434)
                q[i] = x[i] * y[i]

                x_sq[i] = x[i] * x[i]

            xysum = np.sum(q)
            y_sum = np.sum(y)
            x_sqsum = np.sum(x_sq)
            x_avg = np.mean(x)
            y_avg = np.mean(y)
            x_sumsq = x_avg * x_avg
            b_n = xysum - x_avg * y_sum
            b_d = x_sqsum - total * x_sumsq
            b = b_n / b_d
            a = y_avg - b * x_avg

            output[0] = b
            output[1] = np.exp(-a / b)
            return [output[0], output[1]]

        all_data = []
        para = []

        data.loc[data.hours == 0.0, 'hours'] = 1.0
        for i in range(len(threshold_data)):
            threshold_val = float(threshold_data[i][1])
            if i == 0:
                filtered_data = data[data['temp_c'].astype(
                    float) < threshold_val]
                time1 = filtered_data['hours'].astype(float)
                param = weibull_rankreg(time1)
                para.append(param)
                # print('Hello')
            else:
                tt = data['temp_c'].astype(float)
                filtered_data = data[np.logical_and(tt > float(
                    threshold_data[i-1][1]), tt < threshold_val)]
                time = filtered_data['hours'].astype(float)
                param = weibull_rankreg(time)
                para.append(param)
        if len(threshold_data) > 0:
            threshold_val = float(threshold_data[len(threshold_data)-1][1])
            filtered_data = data[data['temp_c'].astype(float) > threshold_val]
            time1 = filtered_data['hours'].astype(float)
            param = weibull_rankreg(time1)
            para.append(param)
            # print('Hello')
        # print(para)
        return para
