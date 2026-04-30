from backend.Mission_reliability_dashboard.taskReliability import TaskReliability
import json
import os


class TaskService:
    def __init__(self):
        self.tc_inst = TaskReliability()

    def save_task_configuration(self, data):
        if not data or "taskData" not in data:
            raise ValueError("Invalid input data")

        taskData = data["taskData"]
        if not taskData:
            raise ValueError("taskData is empty")

        taskData = self._process_tasks(taskData)
        self._validate_tasks(taskData)
        file_path = self._save_to_file(taskData)

        return {"message": "Data Saved Successfully", "path": file_path, "code": 1}
    
    def _process_tasks(self, taskData):
        component = [x for x in taskData if x["type"] == "component"]
        non_component = [x for x in taskData if x["type"] != "component"]

        component = [self.tc_inst.get_eq_id(x) for x in component]
        return non_component + component
    
    def _validate_tasks(self, taskData):
        invalid_tasks = []
        for item in taskData:
            if item["type"] == "component" and "n" in item["data"]:
                exceeded = [
                    k for k in ["k", "k_as", "k_c", "k_ds", "k_elh"]
                    if k in item["data"] and item["data"][k] > item["data"]["n"]
                ]
                if exceeded:
                    invalid_tasks.append((item["data"].get("label", "Unknown"), exceeded))

        if invalid_tasks:
            messages = [
                f"{label} exceeded n for {', '.join(k)}"
                for label, k in invalid_tasks
            ]
            raise ValueError(" ".join(messages))
        
    def _save_to_file(self, taskData):
            directory = "./tasks"
            os.makedirs(directory, exist_ok=True)

            label = taskData[0]["data"].get("label", "default")
            safe_label = "".join(c for c in label if c.isalnum() or c in "_-")

            file_path = os.path.join(directory, f"{safe_label}.json")

            with open(file_path, "w") as f:
                json.dump(taskData, f, indent=4)

            return file_path