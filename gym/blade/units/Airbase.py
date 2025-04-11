import json
from typing import List, Optional
from blade.units.Aircraft import Aircraft
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class Airbase:

    def __init__(
        self,
        id: str,
        name: str,
        side_id: str,
        class_name: str,
        latitude: float,
        longitude: float,
        altitude: float,
        side_color: str | SIDE_COLOR | None = None,
        aircraft: Optional[List[Aircraft]] = None,
    ):
        self.id = id
        self.name = name
        self.side_id = side_id
        self.class_name = class_name
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude  # FT ASL -- currently default
        self.side_color = convert_color_name_to_side_color(side_color)
        self.aircraft = aircraft if aircraft is not None else []

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "side_id": str(self.side_id),
            "class_name": self.class_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "side_color": (
                self.side_color.value
                if isinstance(self.side_color, SIDE_COLOR)
                else self.side_color
            ),
            "aircraft": [ac.to_dict() for ac in self.aircraft],
        }
