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
)

Target = Aircraft | Facility | Weapon | Airbase | Ship


def check_if_threat_is_within_range(
    threat: Aircraft | Weapon, defender: Facility | Ship | Weapon
) -> bool:
    defender_geometry = Point([defender.latitude, defender.longitude]).buffer(
        defender.range * NAUTICAL_MILES_TO_METERS
    )
    threat_geometry = Point([threat.latitude, threat.longitude])
    return defender_geometry.contains(threat_geometry)


def check_target_tracked_by_count(current_scenario: Scenario, target: Target) -> int:
    count = 0
    for weapon in current_scenario.weapons:
        if weapon.target_id == target.id:
            count += 1
    return count


def weapon_endgame(current_scenario: Scenario, weapon: Weapon, target: Target) -> bool:
    current_scenario.weapons.remove(weapon)
    if random_float() <= weapon.lethality:
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
) -> None:
    if len(origin.weapons) == 0:
        return

    weapon_with_max_range_prototype = origin.get_weapon_with_highest_range()
    if not weapon_with_max_range_prototype:
        return

    next_weapon_coordinates = get_next_coordinates(
        origin.latitude,
        origin.longitude,
        target.latitude,
        target.longitude,
        weapon_with_max_range_prototype.speed,
    )
    next_weapon_latitude = next_weapon_coordinates[0]
    next_weapon_longitude = next_weapon_coordinates[1]
    new_weapon = Weapon(
        id=uuid4(),
        name=weapon_with_max_range_prototype.name,
        side_name=origin.side_name,
        class_name=weapon_with_max_range_prototype.class_name,
        latitude=next_weapon_latitude,
        longitude=next_weapon_longitude,
        altitude=weapon_with_max_range_prototype.altitude,
        heading=get_bearing_between_two_points(
            next_weapon_latitude,
            next_weapon_longitude,
            target.latitude,
            target.longitude,
        ),
        speed=weapon_with_max_range_prototype.speed,
        current_fuel=weapon_with_max_range_prototype.current_fuel,
        max_fuel=weapon_with_max_range_prototype.max_fuel,
        fuel_rate=weapon_with_max_range_prototype.fuel_rate,
        range=weapon_with_max_range_prototype.range,
        route=[[target.latitude, target.longitude]],
        side_color=weapon_with_max_range_prototype.side_color,
        target_id=target.id,
        lethality=weapon_with_max_range_prototype.lethality,
        current_quantity=weapon_with_max_range_prototype.current_quantity,
        max_quantity=weapon_with_max_range_prototype.max_quantity,
    )
    current_scenario.weapons.append(new_weapon)
    origin.weapons[0].current_quantity -= 1
    if origin.weapons[0].current_quantity < 1:
        origin.weapons.pop(0)


def weapon_engagement(current_scenario: Scenario, weapon: Weapon) -> None:
    target = current_scenario.get_target(weapon.target_id)
    if target is None:
        current_scenario.weapons.remove(weapon)
    else:
        weapon_route = weapon.route
        if len(weapon_route) > 0:
            if (
                get_distance_between_two_points(
                    weapon.latitude,
                    weapon.longitude,
                    target.latitude,
                    target.longitude,
                )
                < 0.5
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
    aircraft.route = [
        [
            target.latitude if target.latitude - 0.1 < -90 else target.latitude - 0.1,
            (
                target.longitude
                if target.longitude - 0.1 < -180
                else target.longitude - 0.1
            ),
        ]
    ]
    aircraft.heading = get_bearing_between_two_points(
        aircraft.latitude, aircraft.longitude, target.latitude, target.longitude
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

    aircraft.route = [[strike_location[0], strike_location[1]]]
    aircraft.heading = bearing_between_aircraft_and_target
