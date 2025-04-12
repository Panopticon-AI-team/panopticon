from typing import Dict, List, Optional


class Relationships:
    def __init__(
        self,
        hostiles: Optional[Dict[str, List[str]]] = None,
        allies: Optional[Dict[str, List[str]]] = None,
    ):
        self.hostiles: Dict[str, List[str]] = hostiles if hostiles is not None else {}
        self.allies: Dict[str, List[str]] = allies if allies is not None else {}

    def add_hostile(self, side_id: str, hostile_id: str):
        if side_id not in self.hostiles:
            self.hostiles[side_id] = []
        if hostile_id not in self.hostiles[side_id]:
            self.hostiles[side_id].append(hostile_id)
        self.remove_ally(side_id, hostile_id)

    def remove_hostile(self, side_id: str, hostile_id: str):
        if side_id in self.hostiles:
            self.hostiles[side_id] = [
                id for id in self.hostiles[side_id] if id != hostile_id
            ]

    def add_ally(self, side_id: str, ally_id: str):
        if side_id not in self.allies:
            self.allies[side_id] = []
        if ally_id not in self.allies[side_id]:
            self.allies[side_id].append(ally_id)
        self.remove_hostile(side_id, ally_id)

    def remove_ally(self, side_id: str, ally_id: str):
        if side_id in self.allies:
            self.allies[side_id] = [id for id in self.allies[side_id] if id != ally_id]

    def is_ally(self, side_id: str, ally_id: str) -> bool:
        return ally_id in self.allies.get(side_id, [])

    def is_hostile(self, side_id: str, hostile_id: str) -> bool:
        return hostile_id in self.hostiles.get(side_id, [])

    def get_allies(self, side_id: str) -> List[str]:
        return self.allies.get(side_id, [])

    def get_hostiles(self, side_id: str) -> List[str]:
        return self.hostiles.get(side_id, [])

    def update_relationship(self, side_id: str, hostiles: List[str], allies: List[str]):
        self.hostiles[side_id] = hostiles
        self.allies[side_id] = allies

    def delete_side(self, side_id: str):
        for key in self.hostiles:
            self.hostiles[key] = [id for id in self.hostiles[key] if id != side_id]
        for key in self.allies:
            self.allies[key] = [id for id in self.allies[key] if id != side_id]
        self.hostiles.pop(side_id, None)
        self.allies.pop(side_id, None)

    def to_dict(self):
        return {
            "hostiles": self.hostiles,
            "allies": self.allies,
        }
