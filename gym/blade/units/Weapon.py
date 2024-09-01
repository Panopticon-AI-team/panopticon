from typing import List, Optional
from blade.utils.constants import DEFAULT_SIDE_COLOR


class Weapon:
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
        route: Optional[
            List[List[float]]
        ] = None,  # Assuming route is a list of coordinates
        side_color: str = DEFAULT_SIDE_COLOR,
        target_id: Optional[str] = None,
        lethality: float = 0.0,
        max_quantity: int = 0,
        current_quantity: int = 0,
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
        self.target_id = target_id
        self.lethality = lethality
        self.max_quantity = max_quantity
        self.current_quantity = current_quantity
        self.route = route if route is not None else []
        self.side_color = side_color
