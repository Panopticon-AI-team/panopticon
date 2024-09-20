import json
from typing import List, Optional
from blade.utils.constants import DEFAULT_SIDE_COLOR
from blade.units.Aircraft import Aircraft


class Airbase:
    def __init__(
        self,
        id: str,
        name: str,
        side_name: str,
        class_name: str,
        latitude: float,
        longitude: float,
        altitude: float,
        side_color: str = DEFAULT_SIDE_COLOR,
        aircraft: Optional[List[Aircraft]] = None,
    ):
        self.id = id
        self.name = name
        self.side_name = side_name
        self.class_name = class_name
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude  # FT ASL -- currently default
        self.side_color = side_color
        self.aircraft = aircraft if aircraft is not None else []

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)