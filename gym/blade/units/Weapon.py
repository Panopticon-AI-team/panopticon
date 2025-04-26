import json
from typing import List, Optional
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class Weapon:
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
        side_color: str | SIDE_COLOR | None = None,
        target_id: Optional[str] = None,
        lethality: float = 0.0,
        max_quantity: int = 0,
        current_quantity: int = 0,
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
        self.target_id = target_id
        self.lethality = lethality
        self.max_quantity = max_quantity
        self.current_quantity = current_quantity
        self.route = route if route is not None else []
        self.side_color = convert_color_name_to_side_color(side_color)

    def get_engagement_range(self) -> float:
        return self.speed * (self.current_fuel / self.fuel_rate)

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
            "target_id": str(self.target_id),
            "lethality": self.lethality,
            "max_quantity": self.max_quantity,
            "current_quantity": self.current_quantity,
            "route": self.route,
            "side_color": (
                self.side_color.value
                if isinstance(self.side_color, SIDE_COLOR)
                else self.side_color
            ),
        }
