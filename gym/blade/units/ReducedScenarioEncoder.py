import json

class ReducedScenarioEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, "to_dict") and callable(obj.to_dict):
            return obj.to_dict()

        return {super().default(obj)} # will raise TypeError