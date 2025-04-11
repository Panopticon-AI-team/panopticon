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

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "side_id": str(self.side_id),
            "assigned_unit_ids": [str(id) for id in self.assigned_unit_ids],
            "assigned_target_ids": [str(id) for id in self.assigned_target_ids],
            "active": self.active,
        }
