import json
from typing import List, Optional
from blade.utils.constants import DEFAULT_SIDE_COLOR
from blade.units.Weapon import Weapon


class Facility:
    def __init__(
        self,
        id: str,
        name: str,
        side_name: str,
        class_name: str,
        latitude: float = 0.0,
        longitude: float = 0.0,
        altitude: float = 0.0,  # FT ASL -- currently default
        range: float = 250.0,
        side_color: str = DEFAULT_SIDE_COLOR,
        weapons: Optional[List[Weapon]] = None,
    ):
        self.id = id
        self.name = name
        self.side_name = side_name
        self.class_name = class_name
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.range = range
        self.side_color = side_color
        self.weapons = weapons if weapons is not None else []

    def get_total_weapon_quantity(self) -> int:
        return sum([weapon.current_quantity for weapon in self.weapons])

    def get_weapon_with_highest_range(self) -> Weapon | None:
        if len(self.weapons) == 0:
            return None
        return max(self.weapons, key=lambda weapon: weapon.range)

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)