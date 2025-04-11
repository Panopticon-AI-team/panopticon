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

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)
