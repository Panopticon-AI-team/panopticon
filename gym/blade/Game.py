from typing import Tuple
from blade.units.Aircraft import Aircraft
from blade.Scenario import Scenario

from blade.utils.utils import (
    get_bearing_between_two_points,
    get_next_coordinates,
    get_distance_between_two_points,
)
from blade.engine.weaponEngagement import (
    aircraft_pursuit,
    check_if_threat_is_within_range,
    check_target_tracked_by_count,
    launch_weapon,
    route_aircraft_to_strike_position,
    weapon_engagement,
)
from blade.utils.constants import NAUTICAL_MILES_TO_METERS


class Game:
    def __init__(self, curren_scenario: Scenario):
        self.current_scenario = curren_scenario

        self.current_side_name = ""
        self.scenario_paused = True
        self.current_attacker_id = ""

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

    def _get_info(self) -> None:
        return None

    def step(self) -> Tuple[Scenario, float, bool, bool, None]:
        self.update_game_state()
        terminated = False
        truncated = self.check_game_ended()
        reward = 0
        observation = self._get_observation()
        info = self._get_info()
        return observation, reward, terminated, truncated, info

    def reset(self):
        pass

    def check_game_ended(self) -> bool:
        return False
