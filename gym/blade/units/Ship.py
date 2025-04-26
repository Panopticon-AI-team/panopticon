import json
from typing import List, Optional
from blade.units.Aircraft import Aircraft
from blade.units.Weapon import Weapon
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class Ship:

    def __init__(
        self,
        id: str,
        name: str,
        side_id: str,
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
        route: Optional[
            List[List[float]]
        ] = None,  # Assuming route is a list of coordinates
        selected: bool = False,
        side_color: str | SIDE_COLOR | None = None,
        weapons: Optional[List[Weapon]] = None,
        aircraft: Optional[List[Aircraft]] = None,
        desired_route: Optional[List[List[float]]] = None,
    ):
        self.id = id
        self.name = name
        self.side_id = side_id
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
        self.side_color = convert_color_name_to_side_color(side_color)
        self.weapons = weapons if weapons is not None else []
        self.aircraft = aircraft if aircraft is not None else []
        self.desired_route = desired_route if desired_route is not None else []

    def get_total_weapon_quantity(self) -> int:
        return sum([weapon.current_quantity for weapon in self.weapons])

    def get_weapon_with_highest_engagement_range(self) -> Weapon | None:
        if len(self.weapons) == 0:
            return None
        return max(self.weapons, key=lambda weapon: weapon.get_engagement_range())

    def get_detection_range(self) -> float:
        return self.range

    def get_weapon(self, weapon_id: str) -> Weapon | None:
        for weapon in self.weapons:
            if weapon.id == weapon_id:
                return weapon
        return None

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "side_id": str(self.side_id),
            "class_name": self.class_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "heading": self.heading,
            "speed": self.speed,
            "current_fuel": self.current_fuel,
            "max_fuel": self.max_fuel,
            "fuel_rate": self.fuel_rate,
            "range": self.range,
            "route": self.route,
            "selected": self.selected,
            "side_color": (
                self.side_color.value
                if isinstance(self.side_color, SIDE_COLOR)
                else self.side_color
            ),
            "weapons": [weapon.to_dict() for weapon in self.weapons],
            "aircraft": [ac.to_dict() for ac in self.aircraft],
        }
