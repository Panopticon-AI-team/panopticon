import json
from typing import List


class StrikeMission:
    def __init__(
        self,
        id: str,
        name: str,
        side_id: str,
        assigned_unit_ids: List[str],
        assigned_target_ids: List[str],
        active: bool,
    ):
        self.id = id
        self.name = name
        self.side_id = side_id
        self.assigned_unit_ids = assigned_unit_ids
        self.assigned_target_ids = assigned_target_ids
        self.active = active

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)