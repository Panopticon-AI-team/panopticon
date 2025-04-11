import json
from typing import Optional
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class ReferencePoint:
    def __init__(
        self,
        id: str,
        name: str,
        side_id: str,
        latitude: float,
        longitude: float,
        altitude: float,
        side_color: str | SIDE_COLOR | None = None,
    ):
        self.id = id
        self.name = name
        self.side_id = side_id
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.side_color = convert_color_name_to_side_color(side_color)

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "side_id": str(self.side_id),
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "side_color": (
                self.side_color.value
                if isinstance(self.side_color, SIDE_COLOR)
                else self.side_color
            ),
        }
