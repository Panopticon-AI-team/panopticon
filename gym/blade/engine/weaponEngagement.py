from blade.units.Aircraft import Aircraft
from blade.units.Ship import Ship
from blade.units.Facility import Facility
from blade.units.Airbase import Airbase
from blade.units.Weapon import Weapon
from blade.Scenario import Scenario
from shapely.geometry import Point
from uuid import uuid4

from blade.utils.constants import NAUTICAL_MILES_TO_METERS
from blade.utils.utils import (
    get_bearing_between_two_points,
    get_distance_between_two_points,
    get_next_coordinates,
    get_terminal_coordinates_from_distance_and_bearing,
    random_float,
    random_int,
)

Target = Aircraft | Facility | Weapon | Airbase | Ship


def is_threat_detected(
    threat: Aircraft | Weapon, detector: Facility | Ship | Aircraft
) -> bool:
    detector_geometry = Point([detector.latitude, detector.longitude]).buffer(
        detector.get_detection_range()
        / 60  # rough conversion from nautical miles to degrees
    )
    threat_geometry = Point([threat.latitude, threat.longitude])
    return detector_geometry.contains(threat_geometry)


def weapon_can_engage_target(target: Target, weapon: Weapon) -> bool:
    weapon_engagement_range_nm = weapon.get_engagement_range()

    distance_to_target_km = get_distance_between_two_points(
        weapon.latitude, weapon.longitude, target.latitude, target.longitude
    )

    distance_to_target_nm = (distance_to_target_km * 1000) / NAUTICAL_MILES_TO_METERS

    return distance_to_target_nm < weapon_engagement_range_nm


def check_target_tracked_by_count(current_scenario: Scenario, target: Target) -> int:
    count = 0
    for weapon in current_scenario.weapons:
        if weapon.target_id == target.id:
            count += 1
    return count


def weapon_endgame(current_scenario: Scenario, weapon: Weapon, target: Target) -> bool:
    current_scenario.weapons.remove(weapon)
    if random_float(0, 1) <= weapon.lethality:
        if isinstance(target, Aircraft):
            current_scenario.aircraft.remove(target)
        elif isinstance(target, Ship):
            current_scenario.ships.remove(target)
        elif isinstance(target, Facility):
            current_scenario.facilities.remove(target)
        elif isinstance(target, Airbase):
            current_scenario.airbases.remove(target)
        elif isinstance(target, Weapon):
            current_scenario.weapons.remove(target)
        return True
    return False


def launch_weapon(
    current_scenario: Scenario,
    origin: Facility | Ship | Aircraft,
    target: Target,
    launched_weapon: Weapon,
    launched_weapon_quantity: int,
) -> None:
    if (
        len(origin.weapons) == 0
        or launched_weapon.current_quantity < launched_weapon_quantity
    ):
        return

    for _ in range(launched_weapon_quantity):
        next_weapon_coordinates = get_next_coordinates(
            origin.latitude,
            origin.longitude,
            target.latitude,
            target.longitude,
            launched_weapon.speed,
        )
        next_weapon_latitude = next_weapon_coordinates[0]
        next_weapon_longitude = next_weapon_coordinates[1]
        new_weapon = Weapon(
            id=str(uuid4()),
            name=f"{launched_weapon.name} #{random_int(0, 1000)}",
            side_id=origin.side_id,
            class_name=launched_weapon.class_name,
            latitude=next_weapon_latitude,
            longitude=next_weapon_longitude,
            altitude=launched_weapon.altitude,
            heading=get_bearing_between_two_points(
                next_weapon_latitude,
                next_weapon_longitude,
                target.latitude,
                target.longitude,
            ),
            speed=launched_weapon.speed,
            current_fuel=launched_weapon.current_fuel,
            max_fuel=launched_weapon.max_fuel,
            fuel_rate=launched_weapon.fuel_rate,
            range=launched_weapon.range,
            route=[[target.latitude, target.longitude]],
            side_color=launched_weapon.side_color,
            target_id=target.id,
            lethality=launched_weapon.lethality,
            current_quantity=1,
            max_quantity=1,
        )
        current_scenario.weapons.append(new_weapon)
    launched_weapon.current_quantity -= launched_weapon_quantity
    if launched_weapon.current_quantity < 1:
        origin.weapons.remove(launched_weapon)


def weapon_engagement(current_scenario: Scenario, weapon: Weapon) -> None:
    target = current_scenario.get_target(weapon.target_id)
    if target is None:
        current_scenario.weapons.remove(weapon)
    else:
        weapon_route = weapon.route
        if len(weapon_route) > 0:
            # there is a weird bug where a weapon will be teleported a vast distance if it gets too close to the target but weaponEndgame is not called, current solution is to set threshold to 1 km
            if (
                get_distance_between_two_points(
                    weapon.latitude,
                    weapon.longitude,
                    target.latitude,
                    target.longitude,
                )
                < 1
            ):
                weapon_endgame(current_scenario, weapon, target)
            else:
                next_weapon_coordinates = get_next_coordinates(
                    weapon.latitude,
                    weapon.longitude,
                    target.latitude,
                    target.longitude,
                    weapon.speed,
                )
                next_weapon_latitude = next_weapon_coordinates[0]
                next_weapon_longitude = next_weapon_coordinates[1]
                weapon.heading = get_bearing_between_two_points(
                    next_weapon_latitude,
                    next_weapon_longitude,
                    target.latitude,
                    target.longitude,
                )
                weapon.latitude = next_weapon_latitude
                weapon.longitude = next_weapon_longitude
                weapon.current_fuel -= weapon.fuel_rate / 3600
                if weapon.current_fuel <= 0:
                    current_scenario.weapons.remove(weapon)


def aircraft_pursuit(
    current_scenario: Scenario,
    aircraft: Aircraft,
) -> None:
    target = current_scenario.get_aircraft(aircraft.target_id)
    if target is None:
        aircraft.target_id = ""
        return
    if len(aircraft.weapons) < 1:
        return
    
    TRAIL_DISTANCE_NM = 5
    trail_km = (TRAIL_DISTANCE_NM * NAUTICAL_MILES_TO_METERS) / 1000
    behind_bearing = (target.heading + 180) % 360
    trail_position = get_terminal_coordinates_from_distance_and_bearing(
        target.latitude,
        target.longitude,
        trail_km,
        behind_bearing,
    )
    trail_latitude = trail_position[0]
    trail_longitude = trail_position[1]

    aircraft.route = [
        [trail_latitude, trail_longitude],
    ]
    aircraft.heading = get_bearing_between_two_points(
        aircraft.latitude,
        aircraft.longitude,
        trail_latitude,
        trail_longitude,
    )


def route_aircraft_to_strike_position(
    current_scenario: Scenario,
    aircraft: Aircraft,
    target_id: str,
    strike_radius_nm: float,
) -> None:
    target = current_scenario.get_target(target_id)
    if target is None:
        return
    if len(aircraft.weapons) < 1:
        return

    bearing_between_aircraft_and_target = get_bearing_between_two_points(
        aircraft.latitude, aircraft.longitude, target.latitude, target.longitude
    )
    bearing_between_target_and_aircraft = get_bearing_between_two_points(
        target.latitude, target.longitude, aircraft.latitude, aircraft.longitude
    )
    strike_location = get_terminal_coordinates_from_distance_and_bearing(
        target.latitude,
        target.longitude,
        (strike_radius_nm * NAUTICAL_MILES_TO_METERS) / 1000,
        bearing_between_target_and_aircraft,
    )

    aircraft.route.append([strike_location[0], strike_location[1]])
    aircraft.heading = bearing_between_aircraft_and_target
