import json
import copy
from uuid import uuid4
from typing import Tuple, Optional
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
from blade.Relationships import Relationships

from blade.utils.constants import NAUTICAL_MILES_TO_METERS
from blade.utils.colors import SIDE_COLOR
from blade.utils.PlaybackRecorder import PlaybackRecorder
from blade.utils.utils import (
    get_bearing_between_two_points,
    get_next_coordinates,
    get_distance_between_two_points,
    to_camelcase,
)
from blade.engine.weaponEngagement import (
    aircraft_pursuit,
    is_threat_detected,
    check_target_tracked_by_count,
    launch_weapon,
    route_aircraft_to_strike_position,
    weapon_engagement,
    weapon_can_engage_target,
)


class Game:

    def __init__(
        self,
        current_scenario: Scenario,
        record_every_seconds: Optional[int] = None,
        recording_export_path: Optional[str] = ".",
    ):
        self.current_scenario = current_scenario
        self.initial_scenario = current_scenario

        self.current_side_id = ""
        self.recording_scenario = False
        self.recorder = PlaybackRecorder(record_every_seconds, recording_export_path)
        self.scenario_paused = True
        self.current_attacker_id = ""
        self.map_view = {
            "defaultCenter": [0, 0],
            "currentCameraCenter": [0, 0],
            "defaultZoom": 0,
            "currentCameraZoom": 0,
        }

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
                    side_id=aircraft.side_id,
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

    def add_reference_point(
        self, reference_point_name: str, latitude: float, longitude: float
    ) -> ReferencePoint:
        if not self.current_side_id:
            return None

        reference_point = ReferencePoint(
            id=str(uuid4()),
            name=reference_point_name,
            side_id=self.current_side_id,
            latitude=latitude,
            longitude=longitude,
            altitude=0,
            side_color=self.current_scenario.get_side_color(self.current_side_id),
        )
        self.current_scenario.reference_points.append(reference_point)
        return reference_point

    def remove_reference_point(self, reference_point_id: str) -> None:
        self.current_scenario.reference_points.remove(
            self.current_scenario.get_reference_point(reference_point_id)
        )

    def launch_aircraft_from_ship(self, ship_id: str) -> Aircraft | None:
        if not self.current_side_id:
            return None

        ship = self.current_scenario.get_ship(ship_id)
        if ship and len(ship.aircraft) > 0:
            aircraft = ship.aircraft.pop(0)
            if aircraft:
                self.current_scenario.aircraft.append(aircraft)
                return aircraft

    def launch_aircraft_from_airbase(self, airbase_id: str) -> Aircraft | None:
        if not self.current_side_id:
            return None

        airbase = self.current_scenario.get_airbase(airbase_id)
        if airbase and len(airbase.aircraft) > 0:
            aircraft = airbase.aircraft.pop(0)
            if aircraft:
                self.current_scenario.aircraft.append(aircraft)
                return aircraft

    def create_patrol_mission(
        self,
        mission_name: str,
        assigned_units: list[str],
        assigned_area: list[ReferencePoint],
    ) -> None:
        if len(assigned_area) < 3:
            return
        current_side_id = self.current_scenario.get_side(self.current_side_id).id
        mission = PatrolMission(
            id=str(uuid4()),
            name=mission_name,
            side_id=current_side_id if current_side_id else self.current_side_id,
            assigned_unit_ids=assigned_units,
            assigned_area=assigned_area,
            active=True,
        )
        self.current_scenario.missions.append(mission)

    def update_patrol_mission(
        self,
        mission_id: str,
        mission_name: str,
        assigned_units: list[str],
        assigned_area: list[ReferencePoint],
    ) -> None:
        patrol_mission = self.current_scenario.get_patrol_mission(mission_id)
        if patrol_mission:
            if mission_name and mission_name != "":
                patrol_mission.name = mission_name
            if assigned_units and len(assigned_units) > 0:
                patrol_mission.assigned_unit_ids = assigned_units
            if assigned_area and len(assigned_area) > 2:
                patrol_mission.assigned_area = assigned_area
                patrol_mission.update_patrol_area_geometry()

    def create_strike_mission(
        self,
        mission_name: str,
        assigned_attackers: list[str],
        assigned_targets: list[str],
    ) -> None:
        current_side_id = self.current_scenario.get_side(self.current_side_id).id
        strike_mission = StrikeMission(
            id=str(uuid4()),
            name=mission_name,
            side_id=current_side_id if current_side_id else self.current_side_id,
            assigned_unit_ids=assigned_attackers,
            assigned_target_ids=assigned_targets,
            active=True,
        )
        self.current_scenario.missions.append(strike_mission)

    def update_strike_mission(
        self,
        mission_id: str,
        mission_name: str,
        assigned_attackers: list[str],
        assigned_targets: list[str],
    ) -> None:
        strike_mission = self.current_scenario.get_strike_mission(mission_id)
        if strike_mission:
            if mission_name and mission_name != "":
                strike_mission.name = mission_name
            if assigned_attackers and len(assigned_attackers) > 0:
                strike_mission.assigned_unit_ids = assigned_attackers
            if assigned_targets and len(assigned_targets) > 0:
                strike_mission.assigned_target_ids = assigned_targets

    def delete_mission(self, mission_id: str) -> None:
        self.current_scenario.missions = [
            mission
            for mission in self.current_scenario.missions
            if mission.id != mission_id
        ]

    def move_aircraft(self, aircraft_id: str, new_coordinates: list) -> Aircraft | None:
        aircraft = self.current_scenario.get_aircraft(aircraft_id)
        if aircraft:
            aircraft.route = []
            for i in range(len(new_coordinates)):
                new_latitude = new_coordinates[i][0]
                new_longitude = new_coordinates[i][1]
                aircraft.route.append([new_latitude, new_longitude])
            return aircraft

    def move_ship(self, ship_id: str, new_coordinates: list) -> Ship | None:
        ship = self.current_scenario.get_ship(ship_id)
        if ship:
            ship.route = []
            for i in range(len(new_coordinates)):
                new_latitude = new_coordinates[i][0]
                new_longitude = new_coordinates[i][1]
                ship.route.append([new_latitude, new_longitude])
            return ship

    def handle_aircraft_attack(
        self, aircraft_id: str, target_id: str, weapon_id: str, weapon_quantity: int
    ) -> None:
        if weapon_quantity <= 0:
            return
        target = self.current_scenario.get_target(target_id)
        aircraft = self.current_scenario.get_aircraft(aircraft_id)
        if (
            target
            and aircraft
            and target.side_id != aircraft.side_id
            and target.id != aircraft.id
        ):
            weapon = aircraft.get_weapon(weapon_id)
            if weapon:
                launch_weapon(
                    self.current_scenario, aircraft, target, weapon, weapon_quantity
                )

    def handle_ship_attack(
        self, ship_id: str, target_id: str, weapon_id: str, weapon_quantity: int
    ) -> None:
        if weapon_quantity <= 0:
            return
        target = self.current_scenario.get_target(target_id)
        ship = self.current_scenario.get_ship(ship_id)
        if target and ship and target.side_id != ship.side_id and target.id != ship.id:
            weapon = ship.get_weapon(weapon_id)
            if weapon:
                launch_weapon(
                    self.current_scenario, ship, target, weapon, weapon_quantity
                )

    def aircraft_return_to_base(self, aircraft_id: str) -> Aircraft | None:
        aircraft = self.current_scenario.get_aircraft(aircraft_id)
        if aircraft:
            if aircraft.rtb:
                aircraft.rtb = False
                aircraft.route = []
                return aircraft
            else:
                aircraft.rtb = True
                homebase = (
                    self.current_scenario.get_aircraft_homebase(aircraft.id)
                    if aircraft.home_base_id != ""
                    else self.current_scenario.get_closest_base_to_aircraft(aircraft.id)
                )
                if homebase:
                    if aircraft.home_base_id != homebase.id:
                        aircraft.home_base_id = homebase.id
                    return self.move_aircraft(
                        aircraft_id, [[homebase.latitude, homebase.longitude]]
                    )

    def get_fuel_needed_to_return_to_base(self, aircraft: Aircraft) -> float:
        if aircraft.speed == 0:
            return 0
        if aircraft.home_base_id != "":
            home_base = self.current_scenario.get_aircraft_homebase(aircraft.id)
        else:
            home_base = self.current_scenario.get_closest_base_to_aircraft(aircraft.id)

        if home_base:
            distance_between_aircraft_and_base_nm = (
                get_distance_between_two_points(
                    aircraft.latitude,
                    aircraft.longitude,
                    home_base.latitude,
                    home_base.longitude,
                )
                * 1000
            ) / NAUTICAL_MILES_TO_METERS

            time_needed_to_return_to_base_hr = (
                distance_between_aircraft_and_base_nm / aircraft.speed
            )
            fuel_needed_to_return_to_base = (
                time_needed_to_return_to_base_hr * aircraft.fuel_rate
            )

            return fuel_needed_to_return_to_base

        return 0

    def facility_auto_defense(self) -> None:
        for facility in self.current_scenario.facilities:
            for aircraft in self.current_scenario.aircraft:
                if self.current_scenario.is_hostile(facility.side_id, aircraft.side_id):
                    facility_weapon = (
                        facility.get_weapon_with_highest_engagement_range()
                    )
                    if facility_weapon is None:
                        continue
                    if (
                        is_threat_detected(aircraft, facility)
                        and weapon_can_engage_target(aircraft, facility_weapon)
                        and check_target_tracked_by_count(
                            self.current_scenario, aircraft
                        )
                        < 10
                    ):
                        launch_weapon(
                            self.current_scenario,
                            facility,
                            aircraft,
                            facility_weapon,
                            1,
                        )
            for weapon in self.current_scenario.weapons:
                if self.current_scenario.is_hostile(facility.side_id, weapon.side_id):
                    facility_weapon = (
                        facility.get_weapon_with_highest_engagement_range()
                    )
                    if facility_weapon is None:
                        continue
                    if (
                        weapon.target_id == facility.id
                        and is_threat_detected(weapon, facility)
                        and weapon_can_engage_target(weapon, facility_weapon)
                        and check_target_tracked_by_count(self.current_scenario, weapon)
                        < 5
                    ):
                        launch_weapon(
                            self.current_scenario,
                            facility,
                            weapon,
                            facility_weapon,
                            1,
                        )

    def ship_auto_defense(self) -> None:
        for ship in self.current_scenario.ships:
            for aircraft in self.current_scenario.aircraft:
                if self.current_scenario.is_hostile(ship.side_id, aircraft.side_id):
                    ship_weapon = ship.get_weapon_with_highest_engagement_range()
                    if ship_weapon is None:
                        continue
                    if (
                        is_threat_detected(aircraft, ship)
                        and weapon_can_engage_target(aircraft, ship_weapon)
                        and check_target_tracked_by_count(
                            self.current_scenario, aircraft
                        )
                        < 10
                    ):
                        launch_weapon(
                            self.current_scenario,
                            ship,
                            aircraft,
                            ship_weapon,
                            1,
                        )
            for weapon in self.current_scenario.weapons:
                if self.current_scenario.is_hostile(ship.side_id, weapon.side_id):
                    ship_weapon = ship.get_weapon_with_highest_engagement_range()
                    if ship_weapon is None:
                        continue
                    if (
                        weapon.target_id == ship.id
                        and is_threat_detected(weapon, ship)
                        and weapon_can_engage_target(weapon, ship_weapon)
                        and check_target_tracked_by_count(self.current_scenario, weapon)
                        < 5
                    ):
                        launch_weapon(
                            self.current_scenario,
                            ship,
                            weapon,
                            ship_weapon,
                            1,
                        )

    def aircraft_air_to_air_engagement(self) -> None:
        for aircraft in self.current_scenario.aircraft:
            if len(aircraft.weapons) == 0:
                continue
            aircraft_weapon_with_max_range = (
                aircraft.get_weapon_with_highest_engagement_range()
            )
            if aircraft_weapon_with_max_range is None:
                continue
            for enemy_aircraft in self.current_scenario.aircraft:
                if self.current_scenario.is_hostile(
                    aircraft.side_id, enemy_aircraft.side_id
                ) and (
                    aircraft.target_id == "" or aircraft.target_id == enemy_aircraft.id
                ):
                    if (
                        is_threat_detected(enemy_aircraft, aircraft)
                        and weapon_can_engage_target(
                            enemy_aircraft, aircraft_weapon_with_max_range
                        )
                        and check_target_tracked_by_count(
                            self.current_scenario, enemy_aircraft
                        )
                        < 1
                    ):
                        launch_weapon(
                            self.current_scenario,
                            aircraft,
                            enemy_aircraft,
                            aircraft_weapon_with_max_range,
                            1,
                        )
                        aircraft.target_id = enemy_aircraft.id
            for enemy_weapon in self.current_scenario.weapons:
                if self.current_scenario.is_hostile(
                    aircraft.side_id, enemy_weapon.side_id
                ):
                    if (
                        enemy_weapon.target_id == aircraft.id
                        and is_threat_detected(enemy_weapon, aircraft)
                        and weapon_can_engage_target(
                            enemy_weapon, aircraft_weapon_with_max_range
                        )
                        and check_target_tracked_by_count(
                            self.current_scenario, enemy_weapon
                        )
                        < 1
                    ):
                        launch_weapon(
                            self.current_scenario,
                            aircraft,
                            enemy_weapon,
                            aircraft_weapon_with_max_range,
                            1,
                        )
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
                        [unit.route[0][1], unit.route[0][0]]
                    ):
                        unit.route = []
                        random_waypoint_in_patrol_area = (
                            mission.generate_random_coordinates_within_patrol_area()
                        )
                        unit.route.append(random_waypoint_in_patrol_area)

    def clear_completed_strike_missions(self) -> None:
        def mission_filter(mission):
            if isinstance(mission, StrikeMission):
                is_mission_ongoing = True

                target = self.current_scenario.get_target(
                    mission.assigned_target_ids[0]
                )

                if not target:
                    is_mission_ongoing = False

                attackers = list(
                    filter(
                        lambda attacker: attacker is not None,
                        [
                            self.current_scenario.get_aircraft(attacker_id)
                            for attacker_id in mission.assigned_unit_ids
                        ],
                    )
                )

                if len(attackers) < 1:
                    is_mission_ongoing = False

                all_attackers_expended = all(
                    attacker.get_total_weapon_quantity() == 0 for attacker in attackers
                )

                if all_attackers_expended:
                    is_mission_ongoing = False

                if not is_mission_ongoing:
                    for attacker in attackers:
                        self.aircraft_return_to_base(attacker.id)

                return is_mission_ongoing
            else:
                return True

        self.current_scenario.missions = list(
            filter(mission_filter, self.current_scenario.missions)
        )

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
                distance_between_weapon_launch_position_and_target_nm = None
                if len(attacker.route) > 0:
                    distance_between_weapon_launch_position_and_target_nm = (
                        get_distance_between_two_points(
                            attacker.route[len(attacker.route) - 1][0],
                            attacker.route[len(attacker.route) - 1][1],
                            target.latitude,
                            target.longitude,
                        )
                        * 1000
                    ) / NAUTICAL_MILES_TO_METERS

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
                    attacker.get_weapon_with_highest_engagement_range()
                )
                if aircraft_weapon_with_max_range is None:
                    continue
                if (
                    distance_between_weapon_launch_position_and_target_nm is not None
                    and (
                        distance_between_weapon_launch_position_and_target_nm
                        > attacker.get_detection_range() * 1.1
                        or distance_between_weapon_launch_position_and_target_nm
                        > aircraft_weapon_with_max_range.get_engagement_range() * 1.1
                    )
                ) or (
                    distance_between_weapon_launch_position_and_target_nm is None
                    and (
                        distance_between_attacker_and_target_nm
                        > attacker.get_detection_range() * 1.1
                        or distance_between_attacker_and_target_nm
                        > aircraft_weapon_with_max_range.get_engagement_range() * 1.1
                    )
                ):
                    route_aircraft_to_strike_position(
                        self.current_scenario,
                        attacker,
                        mission.assigned_target_ids[0],
                        min(
                            attacker.get_detection_range(),
                            aircraft_weapon_with_max_range.get_engagement_range(),
                        ),
                    )
                elif (
                    distance_between_attacker_and_target_nm
                    <= attacker.get_detection_range() * 1.1
                    and distance_between_attacker_and_target_nm
                    <= aircraft_weapon_with_max_range.get_engagement_range() * 1.1
                ):
                    launched_weapon = (
                        attacker.get_weapon_with_highest_engagement_range()
                    )
                    if launched_weapon is None:
                        continue
                    launch_weapon(
                        self.current_scenario, attacker, target, launched_weapon, 1
                    )
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
            if len(route) > 0:
                next_waypoint = route[0]
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
            fuel_needed_to_return_to_base = self.get_fuel_needed_to_return_to_base(
                aircraft
            )
            if aircraft.current_fuel <= 0:
                self.remove_aircraft(aircraft.id)
            elif (
                aircraft.current_fuel < fuel_needed_to_return_to_base * 1.1
                and not aircraft.rtb
            ):
                self.aircraft_return_to_base(aircraft.id)

    def update_all_ship_position(self) -> None:
        for ship in self.current_scenario.ships:
            route = ship.route
            if len(route) < 1:
                continue
            next_waypoint = route[0]
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
        self.clear_completed_strike_missions()
        self.update_units_on_strike_mission()

        for weapon in self.current_scenario.weapons:
            weapon_engagement(self.current_scenario, weapon)

        self.update_all_aircraft_position()
        self.update_all_ship_position()
        self.update_onboard_weapon_positions()

    def handle_action(self, action: list | str) -> None:
        if not action or action == "" or len(action) == 0:
            return
        try:
            if isinstance(action, str):
                exec(f"{"self." if "self." not in action else ""}{action}")
            elif isinstance(action, list):
                for sub_action in action:
                    exec(f"{"self." if "self." not in sub_action else ""}{sub_action}")
        except Exception as e:
            print(e)

    def _get_observation(self) -> Scenario:
        return self.current_scenario

    def _get_info(self) -> dict:
        return {}

    def step(self, action) -> Tuple[Scenario, float, bool, bool, None]:
        self.handle_action(action)
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
        self.current_side_id = self.current_scenario.sides[0].id
        self.scenario_paused = True
        self.current_attacker_id = ""

    def check_game_ended(self) -> bool:
        return False

    def export_scenario(self) -> dict:
        scenario_json_string = self.current_scenario.toJson()
        scenario_json_no_underscores = to_camelcase(scenario_json_string)

        export_object = {
            "currentScenario": json.loads(scenario_json_no_underscores),
            "currentSideId": self.current_side_id,
            "selectedUnitId": "",
            "mapView": self.map_view,
        }

        return export_object

    def load_scenario(self, scenario_string: str) -> None:
        import_object = json.loads(scenario_string)
        self.current_side_id = import_object["currentSideId"]
        self.map_view = import_object["mapView"]

        saved_scenario = import_object["currentScenario"]
        saved_sides = []
        for side in saved_scenario["sides"]:
            saved_sides.append(
                Side(
                    id=side["id"],
                    name=side["name"],
                    total_score=side["totalScore"],
                    color=side["color"],
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
            relationships=Relationships(
                hostiles=(
                    saved_scenario["relationships"]["hostiles"]
                    if "relationships" in saved_scenario.keys()
                    and saved_scenario["relationships"]["hostiles"]
                    else {}
                ),
                allies=(
                    saved_scenario["relationships"]["allies"]
                    if "relationships" in saved_scenario.keys()
                    and saved_scenario["relationships"]["allies"]
                    else {}
                ),
            ),
        )
        for aircraft in saved_scenario["aircraft"]:
            aircraft_weapons = []
            if aircraft["weapons"]:
                for weapon in aircraft["weapons"]:
                    aircraft_weapons.append(
                        Weapon(
                            id=weapon["id"],
                            name=weapon["name"],
                            side_id=weapon["sideId"],
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
            loaded_scenario.aircraft.append(
                Aircraft(
                    id=aircraft["id"],
                    name=aircraft["name"],
                    side_id=aircraft["sideId"],
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
                    target_id=(
                        aircraft["targetId"] if "targetId" in aircraft.keys() else ""
                    ),
                )
            )
        for airbase in saved_scenario["airbases"]:
            airbase_aircraft = []
            for aircraft in airbase["aircraft"]:
                aircraft_weapons = []
                if aircraft["weapons"]:
                    for weapon in aircraft["weapons"]:
                        aircraft_weapons.append(
                            Weapon(
                                id=weapon["id"],
                                name=weapon["name"],
                                side_id=weapon["sideId"],
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
                new_aircraft = Aircraft(
                    id=aircraft["id"],
                    name=aircraft["name"],
                    side_id=aircraft["sideId"],
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
                    target_id=(
                        aircraft["targetId"] if "targetId" in aircraft.keys() else ""
                    ),
                )
                airbase_aircraft.append(new_aircraft)
            loaded_scenario.airbases.append(
                Airbase(
                    id=airbase["id"],
                    name=airbase["name"],
                    side_id=airbase["sideId"],
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
                            side_id=weapon["sideId"],
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
            loaded_scenario.facilities.append(
                Facility(
                    id=facility["id"],
                    name=facility["name"],
                    side_id=facility["sideId"],
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
                    side_id=weapon["sideId"],
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
                                side_id=weapon["sideId"],
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
                new_aircraft = Aircraft(
                    id=aircraft["id"],
                    name=aircraft["name"],
                    side_id=aircraft["sideId"],
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
                            side_id=weapon["sideId"],
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
            loaded_scenario.ships.append(
                Ship(
                    id=ship["id"],
                    name=ship["name"],
                    side_id=ship["sideId"],
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
                        side_id=reference_point["sideId"],
                        latitude=reference_point["latitude"],
                        longitude=reference_point["longitude"],
                        altitude=reference_point["altitude"],
                        side_color=reference_point["sideColor"],
                    )
                )
        if "missions" in saved_scenario.keys():
            for mission in saved_scenario["missions"]:
                if "assignedArea" in mission.keys():
                    assigned_area = []
                    for point in mission["assignedArea"]:
                        assigned_area.append(
                            ReferencePoint(
                                id=point["id"],
                                name=point["name"],
                                side_id=point["sideId"],
                                latitude=point["latitude"],
                                longitude=point["longitude"],
                                altitude=point["altitude"],
                                side_color=point["sideColor"],
                            )
                        )
                    loaded_scenario.missions.append(
                        PatrolMission(
                            id=mission["id"],
                            name=mission["name"],
                            side_id=mission["sideId"],
                            assigned_unit_ids=mission["assignedUnitIds"],
                            assigned_area=assigned_area,
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

    def start_recording(self):
        self.recorder.start_recording(self.current_scenario)

    def record_step(self, force: bool = False):
        if self.recorder.should_record(self.current_scenario.current_time) or force:
            self.recorder.record_step(
                json.dumps(self.export_scenario()), self.current_scenario.current_time
            )

    def export_recording(self):
        self.recorder.export_recording(self.current_scenario.current_time)
