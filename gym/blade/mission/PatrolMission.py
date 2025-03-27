import json
from typing import List
from random import random
from shapely.geometry import Point, Polygon
from blade.units.ReferencePoint import ReferencePoint


class PatrolMission:

    def __init__(
        self,
        id: str,
        name: str,
        side_id: str,
        assigned_unit_ids: List[str],
        assigned_area: List[ReferencePoint],
        active: bool,
    ):
        self.id = id
        self.name = name
        self.side_id = side_id
        self.assigned_unit_ids = assigned_unit_ids
        self.assigned_area = assigned_area
        self.active = active
        self.patrol_area_geometry = Polygon(
            [(point.longitude, point.latitude) for point in self.assigned_area]
        )

    def update_patrol_area_geometry(self):
        self.patrol_area_geometry = Polygon(
            [(point.longitude, point.latitude) for point in self.assigned_area]
        )

    def check_if_coordinates_is_within_patrol_area(
        self, coordinates: List[float]
    ) -> bool:
        point = Point(coordinates)
        if self.patrol_area_geometry.contains(point):
            return True
        return False

    def generate_random_coordinates_within_patrol_area(self) -> List[float]:
        random_coordinates = [
            random() * (self.assigned_area[2].latitude - self.assigned_area[0].latitude)
            + self.assigned_area[0].latitude,
            random()
            * (self.assigned_area[1].longitude - self.assigned_area[0].longitude)
            + self.assigned_area[0].longitude,
        ]
        return random_coordinates

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__ if hasattr(o, "__dict__") else "",
            sort_keys=True,
            indent=4,
        )
