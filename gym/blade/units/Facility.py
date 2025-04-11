import json
from typing import List, Optional
from blade.units.Weapon import Weapon
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class Facility:
    def __init__(
        self,
        id: str,
        name: str,
        side_id: str,
        class_name: str,
        latitude: float = 0.0,
        longitude: float = 0.0,
        altitude: float = 0.0,  # FT ASL -- currently default
        range: float = 250.0,
        side_color: str | SIDE_COLOR | None = None,
        weapons: Optional[List[Weapon]] = None,
    ):
        self.id = id
        self.name = name
        self.side_id = side_id
        self.class_name = class_name
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.range = range
        self.side_color = convert_color_name_to_side_color(side_color)
        self.weapons = weapons if weapons is not None else []

    def get_total_weapon_quantity(self) -> int:
        return sum([weapon.current_quantity for weapon in self.weapons])

    def get_weapon_with_highest_range(self) -> Weapon | None:
        if len(self.weapons) == 0:
            return None
        return max(self.weapons, key=lambda weapon: weapon.range)

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "side_id": str(self.side_id),
            "class_name": self.class_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "range": self.range,
            "side_color": (
                self.side_color.value
                if isinstance(self.side_color, SIDE_COLOR)
                else self.side_color
            ),
            "weapons": [weapon.to_dict() for weapon in self.weapons],
        }
