import json

from blade.units.Aircraft import Aircraft
from blade.units.Ship import Ship
from blade.units.Facility import Facility
from blade.units.Airbase import Airbase
from blade.units.Weapon import Weapon
from blade.units.ReferencePoint import ReferencePoint
from blade.Side import Side
from blade.mission.PatrolMission import PatrolMission
from blade.mission.StrikeMission import StrikeMission
from blade.utils.utils import get_distance_between_two_points
from blade.utils.colors import SIDE_COLOR
from blade.Relationships import Relationships

HomeBase = Airbase | Ship

Target = Aircraft | Facility | Weapon | Airbase | Ship


class Scenario:
    def __init__(
        self,
        id: str = "",
        name: str = "",
        start_time: int = 0,
        duration: int = 1,
        sides: list[Side] = [],
        current_time: int = None,
        time_compression: int = 1,
        aircraft: list[Aircraft] = None,
        ships: list[Ship] = None,
        facilities: list[Facility] = None,
        airbases: list[Airbase] = None,
        weapons: list[Weapon] = None,
        reference_points: list[ReferencePoint] = None,
        missions: list[PatrolMission | StrikeMission] = None,
        relationships: Relationships = Relationships(),
    ):
        self.id = id
        self.name = name
        self.start_time = start_time
        self.current_time = current_time if current_time is not None else start_time
        self.duration = duration
        self.sides = sides
        self.time_compression = time_compression
        self.aircraft = aircraft if aircraft is not None else []
        self.ships = ships if ships is not None else []
        self.facilities = facilities if facilities is not None else []
        self.airbases = airbases if airbases is not None else []
        self.weapons = weapons if weapons is not None else []
        self.reference_points = reference_points if reference_points is not None else []
        self.missions = missions if missions is not None else []
        self.relationships = relationships

    def get_side(self, side_id: str | None) -> Side | None:
        for side in self.sides:
            if side.id == side_id:
                return side
        return None

    def get_side_name(self, side_id: str | None) -> str:
        side = self.get_side(side_id)
        return side.name if side is not None else "N/A"

    def get_side_color(self, side_id: str | None) -> SIDE_COLOR:
        side = self.get_side(side_id)
        return side.color if side is not None else SIDE_COLOR.BLACK

    def get_aircraft(self, aircraft_id: str) -> Aircraft | None:
        for aircraft in self.aircraft:
            if aircraft.id == aircraft_id:
                return aircraft
        return None

    def get_facility(self, facility_id: str) -> Facility | None:
        for facility in self.facilities:
            if facility.id == facility_id:
                return facility
        return None

    def get_airbase(self, airbase_id: str) -> Airbase | None:
        for airbase in self.airbases:
            if airbase.id == airbase_id:
                return airbase
        return None

    def get_ship(self, ship_id: str) -> Ship | None:
        for ship in self.ships:
            if ship.id == ship_id:
                return ship
        return None

    def get_weapon(self, weapon_id: str) -> Weapon | None:
        for weapon in self.weapons:
            if weapon.id == weapon_id:
                return weapon
        return None

    def get_target(self, target_id: str) -> Target | None:
        for target in (
            self.aircraft + self.ships + self.facilities + self.airbases + self.weapons
        ):
            if target.id == target_id:
                return target
        return None

    def get_reference_point(self, reference_point_id: str) -> ReferencePoint | None:
        for reference_point in self.reference_points:
            if reference_point.id == reference_point_id:
                return reference_point
        return None

    def get_patrol_mission(self, mission_id: str) -> PatrolMission | None:
        for mission in self.missions:
            if isinstance(mission, PatrolMission) and mission.id == mission_id:
                return mission
        return None

    def get_strike_mission(self, mission_id: str) -> StrikeMission | None:
        for mission in self.missions:
            if isinstance(mission, StrikeMission) and mission.id == mission_id:
                return mission
        return None

    def get_all_patrol_missions(self) -> list[PatrolMission]:
        return [
            mission for mission in self.missions if isinstance(mission, PatrolMission)
        ]

    def get_all_strike_missions(self) -> list[StrikeMission]:
        return [
            mission for mission in self.missions if isinstance(mission, StrikeMission)
        ]

    def update_aircraft(
        self,
        aircraft_id: str,
        aircraft_name: str,
        aircraft_class_name: str,
        aircraft_speed: float,
        aircraft_weapon_quantity: float,
        aircraft_current_fuel: float,
        aircraft_fuel_rate: float,
        sample_weapon: Weapon,
    ):
        aircraft = self.get_aircraft(aircraft_id)
        if aircraft is not None:
            aircraft.name = aircraft_name
            aircraft.class_name = aircraft_class_name
            aircraft.speed = aircraft_speed
            if len(aircraft.weapons) < 1:
                aircraft.weapons = [sample_weapon]
            else:
                for weapon in aircraft.weapons:
                    weapon.current_quantity = aircraft_weapon_quantity
            aircraft.current_fuel = aircraft_current_fuel
            aircraft.fuel_rate = aircraft_fuel_rate

    def update_facility(
        self,
        facility_id: str,
        facility_name: str,
        facility_class_name: str,
        facility_range: float,
        facility_weapon_quantity: float,
        sample_weapon: Weapon,
    ):
        facility = self.get_facility(facility_id)
        if facility is not None:
            facility.name = facility_name
            facility.class_name = facility_class_name
            facility.range = facility_range
            if len(facility.weapons) < 1:
                facility.weapons = [sample_weapon]
            else:
                for weapon in facility.weapons:
                    weapon.current_quantity = facility_weapon_quantity

    def update_airbase(
        self,
        airbase_id: str,
        airbase_name: str,
    ):
        airbase = self.get_airbase(airbase_id)
        if airbase is not None:
            airbase.name = airbase_name

    def update_ship(
        self,
        ship_id: str,
        ship_name: str,
        ship_class_name: str,
        ship_speed: float,
        ship_weapon_quantity: float,
        ship_current_fuel: float,
        ship_fuel_rate: float,
        ship_range: float,
        sample_weapon: Weapon,
    ):
        ship = self.get_ship(ship_id)
        if ship is not None:
            ship.name = ship_name
            ship.class_name = ship_class_name
            ship.speed = ship_speed
            if len(ship.weapons) < 1:
                ship.weapons = [sample_weapon]
            else:
                for weapon in ship.weapons:
                    weapon.current_quantity = ship_weapon_quantity
            ship.current_fuel = ship_current_fuel
            ship.fuel_rate = ship_fuel_rate
            ship.range = ship_range

    def update_reference_point(
        self,
        reference_point_id: str,
        reference_point_name: str,
    ):
        reference_point = self.get_reference_point(reference_point_id)
        if reference_point is not None:
            reference_point.name = reference_point_name

    def get_aircraft_homebase(self, aircraft_id: str) -> HomeBase | None:
        aircraft = self.get_aircraft(aircraft_id)
        if aircraft is not None:
            base = self.get_airbase(aircraft.home_base_id)
            if base is not None:
                return base
            else:
                ship = self.get_ship(aircraft.home_base_id)
                if ship is not None:
                    return ship
        return None

    def get_closest_base_to_aircraft(self, aircraft_id: str) -> HomeBase | None:
        aircraft = self.get_aircraft(aircraft_id)
        if aircraft is not None:
            closest_base = None
            closest_distance = float("inf")
            for base in self.airbases + self.ships:
                if base.side_id != aircraft.side_id:
                    continue
                distance = get_distance_between_two_points(
                    aircraft.latitude, aircraft.longitude, base.latitude, base.longitude
                )
                if distance < closest_distance:
                    closest_base = base
                    closest_distance = distance
            return closest_base
        return None

    def get_all_targets_from_enemy_sides(self, side_id: str) -> Target:
        targets = []
        for aircraft in self.aircraft:
            if self.is_hostile(aircraft.side_id, side_id):
                targets.append(aircraft)
        for facility in self.facilities:
            if self.is_hostile(facility.side_id, side_id):
                targets.append(facility)
        for ship in self.ships:
            if self.is_hostile(ship.side_id, side_id):
                targets.append(ship)
        for airbase in self.airbases:
            if self.is_hostile(airbase.side_id, side_id):
                targets.append(airbase)
        return targets

    def is_hostile(self, side_id: str, target_id: str) -> bool:
        return self.relationships.is_hostile(side_id, target_id)

    def to_dict(self):
        def serialize(obj):
            if hasattr(obj, "to_dict"):
                return obj.to_dict()
            elif isinstance(obj, list):
                return [serialize(item) for item in obj]
            elif isinstance(obj, dict):
                return {key: serialize(value) for key, value in obj.items()}
            else:
                return obj

        return serialize(self.__dict__)

    def toJson(self):
        return json.dumps(self.to_dict(), sort_keys=True, indent=4)
