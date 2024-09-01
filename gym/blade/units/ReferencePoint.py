from typing import Optional
from blade.utils.constants import DEFAULT_SIDE_COLOR


class ReferencePoint:
    def __init__(
        self,
        id: str,
        name: str,
        side_name: str,
        latitude: float,
        longitude: float,
        altitude: float,
        side_color: str = DEFAULT_SIDE_COLOR,
    ):
        self.id = id
        self.name = name
        self.side_name = side_name
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.side_color = side_color
