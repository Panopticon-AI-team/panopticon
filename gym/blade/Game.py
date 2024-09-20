import json
import copy
from uuid import uuid4
from typing import Tuple
from blade.units.Aircraft import Aircraft
from blade.units.Airbase import Airbase
from blade.units.Facility import Facility
from blade.units.Ship import Ship
from blade.units.Weapon import Weapon
from blade.units.ReferencePoint import ReferencePoint
from blade.mission.PatrolMission import PatrolMission
from blade.mission.StrikeMission import StrikeMission
from blade.Scenario import Scenario
from blade.Side import Side

from blade.utils.constants import NAUTICAL_MILES_TO_METERS
from blade.utils.utils import (
    get_bearing_between_two_points,
    get_next_coordinates,
    get_distance_between_two_points,
    to_camelcase,
)
from blade.engine.weaponEngagement import (
    aircraft_pursuit,
    check_if_threat_is_within_range,
    check_target_tracked_by_count,
    launch_weapon,
    route_aircraft_to_strike_position,
    weapon_engagement,
)


class Game:
    def __init__(self, current_scenario: Scenario):
        self.current_scenario = current_scenario
        self.initial_scenario = current_scenario

        self.current_side_name = ""
        self.scenario_paused = True
        self.current_attacker_id = ""
        self.map_view = {
            "defaultCenter": [0, 0],
            "currentCameraCenter": [0, 0],
            "defaultZoom": 0,
            "currentCameraZoom": 0,
        }

    def get_sample_weapon(
        self, quantity: int, lethality: float, side_name: str
    ) -> Weapon:
        current_side_name = (
            side_name if side_name is not None else self.current_side_name
        )
        side_color = self.current_scenario.get_side_color(current_side_name)
        return Weapon(
            id=uuid4(),
            name="Sample Weapon",
            side_name=current_side_name,
            class_name="Sample Weapon",
            latitude=0.0,
            longitude=0.0,
            altitude=10000.0,
            heading=90.0,
            speed=1000.0,
            current_fuel=5000.0,
            max_fuel=5000.0,
            fuel_rate=5000.0,
            range=100.0,
            side_color=side_color,
            target_id=None,
            lethality=lethality,
            max_quantity=quantity,
            current_quantity=quantity,
        )

    def load_scenario(self, scenario_string: str) -> None:
        import_object = json.loads(scenario_string)
        self.current_side_name = import_object["currentSideName"]
        self.map_view = import_object["mapView"]

        saved_scenario = import_object["currentScenario"]
        saved_sides = []
        for side in saved_scenario["sides"]:
            saved_sides.append(
                Side(
                    id=side["id"],
                    name=side["name"],
                    total_score=side["totalScore"],
                    side_color=side["sideColor"],
                )
            )
        loaded_scenario = Scenario(
            id=saved_scenario["id"],
            name=saved_scenario["name"],
            start_time=saved_scenario["startTime"],
            current_time=saved_scenario["currentTime"],
            duration=saved_scenario["duration"],
            sides=saved_sides,
            time_compression=saved_scenario["timeCompression"],
        )
        for aircraft in saved_scenario["aircraft"]:
            aircraft_weapons = []
            if aircraft["weapons"]:
                for weapon in aircraft["weapons"]:
                    aircraft_weapons.append(
                        Weapon(
                            id=weapon["id"],
                            name=weapon["name"],
                            side_name=weapon["sideName"],
                            class_name=weapon["className"],
                            latitude=weapon["latitude"],
                            longitude=weapon["longitude"],
                            altitude=weapon["altitude"],
                            heading=weapon["heading"],
                            speed=weapon["speed"],
                            current_fuel=weapon["currentFuel"],
                            max_fuel=weapon["maxFuel"],
                            fuel_rate=weapon["fuelRate"],
                            range=weapon["range"],
                            route=weapon["route"],
                            side_color=weapon["sideColor"],
                            target_id=weapon["targetId"],
                            lethality=weapon["lethality"],
                            max_quantity=weapon["maxQuantity"],
                            current_quantity=weapon["currentQuantity"],
                        )
                    )
            else:
                aircraft_weapons.append(
                    self.get_sample_weapon(10, 0.25, aircraft["sideName"])
                )
            loaded_scenario.aircraft.append(
                Aircraft(
                    id=aircraft["id"],
                    name=aircraft["name"],
                    side_name=aircraft["sideName"],
                    class_name=aircraft["className"],
                    latitude=aircraft["latitude"],
                    longitude=aircraft["longitude"],
                    altitude=aircraft["altitude"],
                    heading=aircraft["heading"],
                    speed=aircraft["speed"],
                    current_fuel=aircraft["currentFuel"],
                    max_fuel=aircraft["maxFuel"],
                    fuel_rate=aircraft["fuelRate"],
                    range=aircraft["range"],
                    route=aircraft["route"],
                    selected=aircraft["selected"],
                    side_color=aircraft["sideColor"],
                    weapons=aircraft_weapons,
                    home_base_id=aircraft["homeBaseId"],
                    rtb=aircraft["rtb"],
                    target_id=aircraft["targetId"] if "targetId" in aircraft.keys() else "",
                )
            )
        for airbase in saved_scenario["airbases"]:
            airbase_aircraft = []
            for aircraft in airbase["aircraft"]:
                new_aircraft = Aircraft(
                    id=aircraft["id"],
                    name=aircraft["name"],
                    side_name=aircraft["sideName"],
                    class_name=aircraft["className"],
                    latitude=aircraft["latitude"],
                    longitude=aircraft["longitude"],
                    altitude=aircraft["altitude"],
                    heading=aircraft["heading"],
                    speed=aircraft["speed"],
                    current_fuel=aircraft["currentFuel"],
                    max_fuel=aircraft["maxFuel"],
                    fuel_rate=aircraft["fuelRate"],
                    range=aircraft["range"],
                    route=aircraft["route"],
                    selected=aircraft["selected"],
                    side_color=aircraft["sideColor"],
                    weapons=(
                        aircraft["weapons"]
                        if aircraft["weapons"]
                        else [self.get_sample_weapon(10, 0.25, aircraft["sideName"])]
                    ),
                    home_base_id=aircraft["homeBaseId"],
                    rtb=aircraft["rtb"],
                    target_id=aircraft["targetId"] if "targetId" in aircraft.keys() else "",
                )
                airbase_aircraft.append(new_aircraft)
            loaded_scenario.airbases.append(
                Airbase(
                    id=airbase["id"],
                    name=airbase["name"],
                    side_name=airbase["sideName"],
                    class_name=airbase["className"],
                    latitude=airbase["latitude"],
                    longitude=airbase["longitude"],
                    altitude=airbase["altitude"],
                    side_color=airbase["sideColor"],
                    aircraft=airbase_aircraft,
                )
            )
        for facility in saved_scenario["facilities"]:
            facility_weapons = []
            if facility["weapons"]:
                for weapon in facility["weapons"]:
                    facility_weapons.append(
                        Weapon(
                            id=weapon["id"],
                            name=weapon["name"],
                            side_name=weapon["sideName"],
                            class_name=weapon["className"],
                            latitude=weapon["latitude"],
                            longitude=weapon["longitude"],
                            altitude=weapon["altitude"],
                            heading=weapon["heading"],
                            speed=weapon["speed"],
                            current_fuel=weapon["currentFuel"],
                            max_fuel=weapon["maxFuel"],
                            fuel_rate=weapon["fuelRate"],
                            range=weapon["range"],
                            route=weapon["route"],
                            side_color=weapon["sideColor"],
                            target_id=weapon["targetId"],
                            lethality=weapon["lethality"],
                            max_quantity=weapon["maxQuantity"],
                            current_quantity=weapon["currentQuantity"],
                        )
                    )
            else:
                facility_weapons.append(
                    self.get_sample_weapon(10, 0.25, facility["sideName"])
                )
            loaded_scenario.facilities.append(
                Facility(
                    id=facility["id"],
                    name=facility["name"],
                    side_name=facility["sideName"],
                    class_name=facility["className"],
                    latitude=facility["latitude"],
                    longitude=facility["longitude"],
                    altitude=facility["altitude"],
                    range=facility["range"],
                    side_color=facility["sideColor"],
                    weapons=facility_weapons,
                )
            )
        for weapon in saved_scenario["weapons"]:
            loaded_scenario.weapons.append(
                Weapon(
                    id=weapon["id"],
                    name=weapon["name"],
                    side_name=weapon["sideName"],
                    class_name=weapon["className"],
                    latitude=weapon["latitude"],
                    longitude=weapon["longitude"],
                    altitude=weapon["altitude"],
                    heading=weapon["heading"],
                    speed=weapon["speed"],
                    current_fuel=weapon["currentFuel"],
                    max_fuel=weapon["maxFuel"],
                    fuel_rate=weapon["fuelRate"],
                    range=weapon["range"],
                    route=weapon["route"],
                    side_color=weapon["sideColor"],
                    target_id=weapon["targetId"],
                    lethality=weapon["lethality"],
                    max_quantity=weapon["maxQuantity"],
                    current_quantity=weapon["currentQuantity"],
                )
            )
        for ship in saved_scenario["ships"]:
            ship_aircraft = []
            for aircraft in ship["aircraft"]:
                aircraft_weapons = []
                if aircraft["weapons"]:
                    for weapon in aircraft["weapons"]:
                        aircraft_weapons.append(
                            Weapon(
                                id=weapon["id"],
                                name=weapon["name"],
                                side_name=weapon["sideName"],
                                class_name=weapon["className"],
                                latitude=weapon["latitude"],
                                longitude=weapon["longitude"],
                                altitude=weapon["altitude"],
                                heading=weapon["heading"],
                                speed=weapon["speed"],
                                current_fuel=weapon["currentFuel"],
                                max_fuel=weapon["maxFuel"],
                                fuel_rate=weapon["fuelRate"],
                                range=weapon["range"],
                                route=weapon["route"],
                                side_color=weapon["sideColor"],
                                target_id=weapon["targetId"],
                                lethality=weapon["lethality"],
                                max_quantity=weapon["maxQuantity"],
                                current_quantity=weapon["currentQuantity"],
                            )
                        )
                else:
                    aircraft_weapons.append(
                        self.get_sample_weapon(10, 0.25, aircraft["sideName"])
                    )
                new_aircraft = Aircraft(
                    id=aircraft["id"],
                    name=aircraft["name"],
                    side_name=aircraft["sideName"],
                    class_name=aircraft["className"],
                    latitude=aircraft["latitude"],
                    longitude=aircraft["longitude"],
                    altitude=aircraft["altitude"],
                    heading=aircraft["heading"],
                    speed=aircraft["speed"],
                    current_fuel=aircraft["currentFuel"],
                    max_fuel=aircraft["maxFuel"],
                    fuel_rate=aircraft["fuelRate"],
                    range=aircraft["range"],
                    route=aircraft["route"],
                    selected=aircraft["selected"],
                    side_color=aircraft["sideColor"],
                    weapons=aircraft_weapons,
                    home_base_id=aircraft["homeBaseId"],
                    rtb=aircraft["rtb"],
                    target_id=aircraft["targetId"] if aircraft["targetId"] else "",
                )
                ship_aircraft.append(new_aircraft)
            ship_weapons = []
            if ship["weapons"]:
                for weapon in ship["weapons"]:
                    ship_weapons.append(
                        Weapon(
                            id=weapon["id"],
                            name=weapon["name"],
                            side_name=weapon["sideName"],
                            class_name=weapon["className"],
                            latitude=weapon["latitude"],
                            longitude=weapon["longitude"],
                            altitude=weapon["altitude"],
                            heading=weapon["heading"],
                            speed=weapon["speed"],
                            current_fuel=weapon["currentFuel"],
                            max_fuel=weapon["maxFuel"],
                            fuel_rate=weapon["fuelRate"],
                            range=weapon["range"],
                            route=weapon["route"],
                            side_color=weapon["sideColor"],
                            target_id=weapon["targetId"],
                            lethality=weapon["lethality"],
                            max_quantity=weapon["maxQuantity"],
                            current_quantity=weapon["currentQuantity"],
                        )
                    )
            else:
                ship_weapons.append(self.get_sample_weapon(10, 0.25, ship["sideName"]))
            loaded_scenario.ships.append(
                Ship(
                    id=ship["id"],
                    name=ship["name"],
                    side_name=ship["sideName"],
                    class_name=ship["className"],
                    latitude=ship["latitude"],
                    longitude=ship["longitude"],
                    altitude=ship["altitude"],
                    heading=ship["heading"],
                    speed=ship["speed"],
                    current_fuel=ship["currentFuel"],
                    max_fuel=ship["maxFuel"],
                    fuel_rate=ship["fuelRate"],
                    range=ship["range"],
                    route=ship["route"],
                    side_color=ship["sideColor"],
                    weapons=ship_weapons,
                    aircraft=ship_aircraft,
                )
            )
        if "referencePoints" in saved_scenario.keys():
            for reference_point in saved_scenario["referencePoints"]:
                loaded_scenario.reference_points.append(
                    ReferencePoint(
                        id=reference_point["id"],
                        name=reference_point["name"],
                        side_name=reference_point["sideName"],
                        latitude=reference_point["latitude"],
                        longitude=reference_point["longitude"],
                        altitude=reference_point["altitude"],
                        side_color=reference_point["sideColor"],
                    )
                )
        if "missions" in saved_scenario.keys():
            for mission in saved_scenario["missions"]:
                if "assignedArea" in mission.keys():
                    loaded_scenario.missions.append(
                        PatrolMission(
                            id=mission["id"],
                            name=mission["name"],
                            side_id=mission["sideId"],
                            assigned_unit_ids=mission["assignedUnitIds"],
                            assigned_area=mission["assignedArea"],
                            active=mission["active"],
                        )
                    )
                else:
                    loaded_scenario.missions.append(
                        StrikeMission(
                            id=mission["id"],
                            name=mission["name"],
                            side_id=mission["sideId"],
                            assigned_unit_ids=mission["assignedUnitIds"],
                            assigned_target_ids=mission["assignedTargetIds"],
                            active=mission["active"],
                        )
                    )

        self.initial_scenario = copy.deepcopy(loaded_scenario)
        self.current_scenario = loaded_scenario

    def remove_aircraft(self, aircraft_id: str) -> None:
        self.current_scenario.aircraft.remove(
            self.current_scenario.get_aircraft(aircraft_id)
        )

    def land_aicraft(self, aircraft_id: str) -> None:
        aircraft = self.current_scenario.get_aircraft(aircraft_id)
        if aircraft is not None and aircraft.rtb:
            homebase = self.current_scenario.get_aircraft_homebase(aircraft.id)
            if homebase is not None:
                new_aircraft = Aircraft(
                    id=aircraft.id,
                    name=aircraft.name,
                    side_name=aircraft.side_name,
                    class_name=aircraft.class_name,
                    latitude=homebase.latitude - 0.5,
                    longitude=homebase.longitude - 0.5,
                    altitude=aircraft.altitude,
                    heading=90.0,
                    speed=aircraft.speed,
                    current_fuel=aircraft.current_fuel,
                    max_fuel=aircraft.max_fuel,
                    fuel_rate=aircraft.fuel_rate,
                    range=aircraft.range,
                    side_color=aircraft.side_color,
                    weapons=aircraft.weapons,
                    home_base_id=aircraft.home_base_id,
                    rtb=False,
                    target_id=aircraft.target_id,
                )
                homebase.aircraft.append(new_aircraft)
                self.remove_aircraft(aircraft.id)

    def facility_auto_defense(self) -> None:
        for facility in self.current_scenario.facilities:
            for aircraft in self.current_scenario.aircraft:
                if facility.side_name != aircraft.side_name:
                    if (
                        check_if_threat_is_within_range(aircraft, facility)
                        and check_target_tracked_by_count(
                            self.current_scenario, aircraft
                        )
                        < 10
                    ):
                        launch_weapon(self.current_scenario, facility, aircraft)
            for weapon in self.current_scenario.weapons:
                if facility.side_name != weapon.side_name:
                    if (
                        weapon.target_id == facility.id
                        and check_if_threat_is_within_range(weapon, facility)
                        and check_target_tracked_by_count(self.current_scenario, weapon)
                        < 5
                    ):
                        launch_weapon(self.current_scenario, facility, weapon)

    def ship_auto_defense(self) -> None:
        for ship in self.current_scenario.ships:
            for aircraft in self.current_scenario.aircraft:
                if ship.side_name != aircraft.side_name:
                    if (
                        check_if_threat_is_within_range(aircraft, ship)
                        and check_target_tracked_by_count(
                            self.current_scenario, aircraft
                        )
                        < 10
                    ):
                        launch_weapon(self.current_scenario, ship, aircraft)
            for weapon in self.current_scenario.weapons:
                if ship.side_name != weapon.side_name:
                    if (
                        weapon.target_id == ship.id
                        and check_if_threat_is_within_range(weapon, ship)
                        and check_target_tracked_by_count(self.current_scenario, weapon)
                        < 5
                    ):
                        launch_weapon(self.current_scenario, ship, weapon)

    def aircraft_air_to_air_engagement(self) -> None:
        for aircraft in self.current_scenario.aircraft:
            if len(aircraft.weapons) == 0:
                continue
            aircraft_weapon_with_max_range = aircraft.get_weapon_with_highest_range()
            if aircraft_weapon_with_max_range is None:
                continue
            for enemy_aircraft in self.current_scenario.aircraft:
                if aircraft.side_name != enemy_aircraft.side_name and (
                    aircraft.target_id == "" or aircraft.target_id == enemy_aircraft.id
                ):
                    if (
                        check_if_threat_is_within_range(
                            enemy_aircraft, aircraft_weapon_with_max_range
                        )
                        and check_target_tracked_by_count(
                            self.current_scenario, enemy_aircraft
                        )
                        < 1
                    ):
                        launch_weapon(self.current_scenario, aircraft, enemy_aircraft)
                        aircraft.target_id = enemy_aircraft.id
            for enemy_weapon in self.current_scenario.weapons:
                if aircraft.side_name != enemy_weapon.side_name:
                    if (
                        enemy_weapon.target_id == aircraft.id
                        and check_if_threat_is_within_range(
                            enemy_weapon, aircraft_weapon_with_max_range
                        )
                        and check_target_tracked_by_count(
                            self.current_scenario, enemy_weapon
                        )
                        < 1
                    ):
                        launch_weapon(self.current_scenario, aircraft, enemy_weapon)
            if aircraft.target_id and aircraft.target_id != "":
                aircraft_pursuit(self.current_scenario, aircraft)

    def update_units_on_patrol_mission(self):
        active_patrol_missions = list(
            filter(
                lambda mission: mission.active,
                self.current_scenario.get_all_patrol_missions(),
            )
        )
        if len(active_patrol_missions) < 1:
            return

        for mission in active_patrol_missions:
            if len(mission.assigned_area) < 3:
                continue
            for unit_id in mission.assigned_unit_ids:
                unit = self.current_scenario.get_aircraft(unit_id)
                if unit is None:
                    continue
                if len(unit.route) == 0:
                    random_waypoint_in_patrol_area = (
                        mission.generate_random_coordinates_within_patrol_area()
                    )
                    unit.route.append(random_waypoint_in_patrol_area)
                elif len(unit.route) > 0:
                    if not mission.check_if_coordinates_is_within_patrol_area(
                        unit.route[len(unit.route) - 1]
                    ):
                        unit.route = []
                        random_waypoint_in_patrol_area = (
                            mission.generate_random_coordinates_within_patrol_area()
                        )
                        unit.route.append(random_waypoint_in_patrol_area)

    def update_units_on_strike_mission(self):
        active_strike_missions = list(
            filter(
                lambda mission: mission.active,
                self.current_scenario.get_all_strike_missions(),
            )
        )
        if len(active_strike_missions) < 1:
            return

        for mission in active_strike_missions:
            if len(mission.assigned_target_ids) < 1:
                continue
            for attacker_id in mission.assigned_unit_ids:
                attacker = self.current_scenario.get_aircraft(attacker_id)
                if attacker is None:
                    continue
                target = self.current_scenario.get_target(
                    mission.assigned_target_ids[0]
                )
                if target is None:
                    continue
                distance_between_attacker_and_target_nm = (
                    get_distance_between_two_points(
                        attacker.latitude,
                        attacker.longitude,
                        target.latitude,
                        target.longitude,
                    )
                    * 1000
                ) / NAUTICAL_MILES_TO_METERS
                aircraft_weapon_with_max_range = (
                    attacker.get_weapon_with_highest_range()
                )
                if aircraft_weapon_with_max_range is None:
                    continue
                if (
                    distance_between_attacker_and_target_nm
                    > aircraft_weapon_with_max_range.range * 1.1
                ):
                    route_aircraft_to_strike_position(
                        self.current_scenario,
                        attacker,
                        mission.assigned_target_ids[0],
                        aircraft_weapon_with_max_range.range,
                    )
                else:
                    launch_weapon(self.current_scenario, attacker, target)
                    attacker.target_id = target.id

    def update_all_aircraft_position(self) -> None:
        for aircraft in self.current_scenario.aircraft:
            if aircraft.rtb:
                aircraft_homebase = (
                    self.current_scenario.get_aircraft_homebase(aircraft.id)
                    if aircraft.home_base_id != ""
                    else self.current_scenario.get_closest_base_to_aircraft(aircraft.id)
                )
                if (
                    aircraft_homebase is not None
                    and get_distance_between_two_points(
                        aircraft.latitude,
                        aircraft.longitude,
                        aircraft_homebase.latitude,
                        aircraft_homebase.longitude,
                    )
                    < 0.5
                ):
                    self.land_aicraft(aircraft.id)
                    continue

            route = aircraft.route
            if len(route) < 1:
                continue
            next_waypoint = route[len(route) - 1]
            next_waypoint_latitude = next_waypoint[0]
            next_waypoint_longitude = next_waypoint[1]
            if (
                get_distance_between_two_points(
                    aircraft.latitude,
                    aircraft.longitude,
                    next_waypoint_latitude,
                    next_waypoint_longitude,
                )
                < 0.5
            ):
                aircraft.latitude = next_waypoint_latitude
                aircraft.longitude = next_waypoint_longitude
                aircraft.route.pop(0)
            else:
                next_aircraft_coordinates = get_next_coordinates(
                    aircraft.latitude,
                    aircraft.longitude,
                    next_waypoint_latitude,
                    next_waypoint_longitude,
                    aircraft.speed,
                )
                next_aircraft_latitude = next_aircraft_coordinates[0]
                next_aircraft_longitude = next_aircraft_coordinates[1]
                aircraft.latitude = next_aircraft_latitude
                aircraft.longitude = next_aircraft_longitude
                aircraft.heading = get_bearing_between_two_points(
                    aircraft.latitude,
                    aircraft.longitude,
                    next_waypoint_latitude,
                    next_waypoint_longitude,
                )
            aircraft.current_fuel -= aircraft.fuel_rate / 3600
            if aircraft.current_fuel <= 0:
                self.remove_aircraft(aircraft.id)

    def update_all_ship_position(self) -> None:
        for ship in self.current_scenario.ships:
            route = ship.route
            if len(route) < 1:
                continue
            next_waypoint = route[len(route) - 1]
            next_waypoint_latitude = next_waypoint[0]
            next_waypoint_longitude = next_waypoint[1]
            if (
                get_distance_between_two_points(
                    ship.latitude,
                    ship.longitude,
                    next_waypoint_latitude,
                    next_waypoint_longitude,
                )
                < 0.5
            ):
                ship.latitude = next_waypoint_latitude
                ship.longitude = next_waypoint_longitude
                ship.route.pop(0)
            else:
                next_ship_coordinates = get_next_coordinates(
                    ship.latitude,
                    ship.longitude,
                    next_waypoint_latitude,
                    next_waypoint_longitude,
                    ship.speed,
                )
                next_ship_latitude = next_ship_coordinates[0]
                next_ship_longitude = next_ship_coordinates[1]
                ship.latitude = next_ship_latitude
                ship.longitude = next_ship_longitude
                ship.heading = get_bearing_between_two_points(
                    ship.latitude,
                    ship.longitude,
                    next_waypoint_latitude,
                    next_waypoint_longitude,
                )
            ship.current_fuel -= ship.fuel_rate / 3600
            if ship.current_fuel <= 0:
                self.current_scenario.ships.remove(ship)

    def update_onboard_weapon_positions(self) -> None:
        for aircraft in self.current_scenario.aircraft:
            for weapon in aircraft.weapons:
                weapon.latitude = aircraft.latitude
                weapon.longitude = aircraft.longitude
        for facility in self.current_scenario.facilities:
            for weapon in facility.weapons:
                weapon.latitude = facility.latitude
                weapon.longitude = facility.longitude
        for ship in self.current_scenario.ships:
            for weapon in ship.weapons:
                weapon.latitude = ship.latitude
                weapon.longitude = ship.longitude

    def update_game_state(self) -> None:
        self.current_scenario.current_time += 1

        self.facility_auto_defense()
        self.ship_auto_defense()
        self.aircraft_air_to_air_engagement()

        self.update_units_on_patrol_mission()
        self.update_units_on_strike_mission()

        for weapon in self.current_scenario.weapons:
            weapon_engagement(self.current_scenario, weapon)

        self.update_all_aircraft_position()
        self.update_all_ship_position()
        self.update_onboard_weapon_positions()

    def _get_observation(self) -> Scenario:
        return self.current_scenario

    def _get_info(self) -> dict:
        return {}

    def step(self, action) -> Tuple[Scenario, float, bool, bool, None]:
        self.update_game_state()
        terminated = False
        truncated = self.check_game_ended()
        reward = 0
        observation = self._get_observation()
        info = self._get_info()
        return observation, reward, terminated, truncated, info

    def reset(self):
        self.current_scenario = copy.deepcopy(self.initial_scenario)
        assert len(self.current_scenario.sides) > 0
        self.current_side_name = self.current_scenario.sides[0].name
        self.scenario_paused = True
        self.current_attacker_id = ""

    def check_game_ended(self) -> bool:
        return False

    def export_scenario(self) -> dict: 
        scenario_json_string = self.current_scenario.toJSON()
        scenario_json_no_underscores = to_camelcase(scenario_json_string)

        export_object = {
            "currentScenario": json.loads(scenario_json_no_underscores),
            "currentSideName": self.current_side_name,
            "selectedUnitId": "",
            "mapView": self.map_view,
        }

        return export_object