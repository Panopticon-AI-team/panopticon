from typing import List, Optional
from blade.utils.constants import DEFAULT_SIDE_COLOR
from blade.units.Weapon import Weapon


class Aircraft:
    def __init__(
        self,
        id: str,
        name: str,
        side_name: str,
        class_name: str,
        latitude: float,
        longitude: float,
        altitude: float,
        heading: float,
        speed: float,
        current_fuel: float,
        max_fuel: float,
        fuel_rate: float,  # lbs/hr
        range: float,
        route: Optional[List[List[float]]] = None,
        selected: bool = False,
        side_color: str = DEFAULT_SIDE_COLOR,
        weapons: Optional[List[Weapon]] = None,
        home_base_id: Optional[str] = "",
        rtb: bool = False,
        target_id: Optional[str] = "",
    ):
        self.id = id
        self.name = name
        self.side_name = side_name
        self.class_name = class_name
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.heading = heading
        self.speed = speed
        self.current_fuel = current_fuel
        self.max_fuel = max_fuel
        self.fuel_rate = fuel_rate
        self.range = range
        self.route = route if route is not None else []
        self.selected = selected
        self.side_color = side_color
        self.weapons = weapons if weapons is not None else []
        self.home_base_id = home_base_id if home_base_id is not None else ""
        self.rtb = rtb
        self.target_id = target_id if target_id is not None else ""

    def get_total_weapon_quantity(self) -> int:
        return sum([weapon.current_quantity for weapon in self.weapons])

    def get_weapon_with_highest_range(self) -> Weapon | None:
        if len(self.weapons) == 0:
            return None
        return max(self.weapons, key=lambda weapon: weapon.range)
