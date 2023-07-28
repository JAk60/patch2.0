from mainHelp import MainHelp


class StageHelper:
    def rel(self, num_of_stage=4, currStage=1, *args):
        helper = MainHelp()
        if num_of_stage == 4:
            if currStage == 1:
                op = helper.stage1_triple_integration(args)
                return op
            elif currStage == 2:
                op = helper.stage2_double_integration(args)
                return op
            elif currStage == 3:
                op = helper.stage3_single_integration(args)
                return op
            else:
                op = helper.stage4_no_integration(args)
                return op
        if num_of_stage == 3:
            if currStage == 1:
                op = helper.stage2_double_integration(args)
                return op
            elif currStage == 2:
                op = helper.stage3_single_integration(args)
                return op
            else:
                op = helper.stage4_no_integration(args)
                return op

        if num_of_stage == 2:
            if currStage == 1:
                op = helper.stage3_single_integration(args)
                return op
            else:
                op = helper.stage4_no_integration(args)
                return op

        if num_of_stage == 1:
            op = helper.stage4_no_integration(args)
            return op
