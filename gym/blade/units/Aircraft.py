import json
from typing import List, Optional
from blade.units.Weapon import Weapon
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class BlackBox:
    def __init__(self):
        self._logs = []

    def log(self, timestamp, latitude, longitude, heading, speed, fuel):
        if not isinstance(timestamp, (int, float)):
            raise ValueError("Timestamp must be a number.")
        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90.")
        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180.")
        if not isinstance(heading, (int, float)):
            raise ValueError("Heading must be a number.")
        if speed < 0:
            raise ValueError("Speed must be non-negative.")
        if fuel < 0:
            raise ValueError("Fuel must be non-negative.")

        self._logs.append(
            {
                "timestamp": timestamp,
                "latitude": latitude,
                "longitude": longitude,
                "heading": heading,
                "speed": speed,
                "fuel": fuel,
            }
        )

    def get_logs(self, timestamp=None, key: str = ""):
        if timestamp is None:
            return self._logs

        if not (0 <= timestamp < len(self._logs)):
            raise IndexError("Timestamp out of range.")

        log = self._logs[timestamp]

        if key:
            if key not in log:
                raise KeyError(f"Key '{key}' not found in log(s).")
            return log[key]

        return log

    def get_last_log_pp(self):
        if not self._logs:
            return None

        import json

        formatted_log = json.dumps(self._logs[-1], indent=4, sort_keys=True)

        return formatted_log

    def get_last_log(self):
        if not self._logs:
            return None

        return self._logs[-1]

    def filter_logs_by_key(self, key, value):
        if not self._logs:
            return []

        if key not in self._logs[0]:
            raise KeyError(f"Key '{key}' not found in log entries.")

        return [log for log in self._logs if log[key] == value]


class Aircraft:

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
        route: Optional[List[List[float]]] = None,
        selected: bool = False,
        side_color: str | SIDE_COLOR | None = None,
        weapons: Optional[List[Weapon]] = None,
        home_base_id: Optional[str] = "",
        rtb: bool = False,
        target_id: Optional[str] = "",
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
        self.home_base_id = home_base_id if home_base_id is not None else ""
        self.rtb = rtb
        self.target_id = target_id if target_id is not None else ""
        self.black_box = BlackBox()
        self.desired_route = desired_route if desired_route is not None else []

    def get_total_weapon_quantity(self) -> int:
        return sum([weapon.current_quantity for weapon in self.weapons])

    def get_weapon_with_highest_range(self) -> Weapon | None:
        if len(self.weapons) == 0:
            return None
        return max(self.weapons, key=lambda weapon: weapon.range)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)
