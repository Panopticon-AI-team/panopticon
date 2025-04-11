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

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)
