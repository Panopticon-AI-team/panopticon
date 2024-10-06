import re
import math
import random
from typing import List
from blade.utils.constants import EARTH_RADIUS_KM, KILOMETERS_TO_NAUTICAL_MILES


def to_radians(degrees: float) -> float:
    return math.radians(degrees)


def to_degrees(radians: float) -> float:
    return math.degrees(radians)


def get_bearing_between_two_points(
    start_latitude: float,
    start_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
) -> float:
    start_latitude = to_radians(start_latitude)
    start_longitude = to_radians(start_longitude)
    destination_latitude = to_radians(destination_latitude)
    destination_longitude = to_radians(destination_longitude)

    y = math.sin(destination_longitude - start_longitude) * math.cos(
        destination_latitude
    )
    x = math.cos(start_latitude) * math.sin(destination_latitude) - math.sin(
        start_latitude
    ) * math.cos(destination_latitude) * math.cos(
        destination_longitude - start_longitude
    )
    bearing = (to_degrees(math.atan2(y, x)) + 360) % 360

    return bearing


def get_distance_between_two_points(
    start_latitude: float,
    start_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
) -> float:
    φ1 = to_radians(start_latitude)
    φ2 = to_radians(destination_latitude)
    Δφ = to_radians(destination_latitude - start_latitude)
    Δλ = to_radians(destination_longitude - start_longitude)

    a = math.sin(Δφ / 2) * math.sin(Δφ / 2) + math.cos(φ1) * math.cos(φ2) * math.sin(
        Δλ / 2
    ) * math.sin(Δλ / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    d = EARTH_RADIUS_KM * c  # in kilometers

    return d


def get_terminal_coordinates_from_distance_and_bearing(
    start_latitude: float, start_longitude: float, distance: float, bearing: float
) -> List[float]:
    bearing_in_radians = to_radians(bearing)

    initial_latitude = to_radians(start_latitude)
    initial_longitude = to_radians(start_longitude)

    final_latitude = math.asin(
        math.sin(initial_latitude) * math.cos(distance / EARTH_RADIUS_KM)
        + math.cos(initial_latitude)
        * math.sin(distance / EARTH_RADIUS_KM)
        * math.cos(bearing_in_radians)
    )
    final_longitude = initial_longitude + math.atan2(
        math.sin(bearing_in_radians)
        * math.sin(distance / EARTH_RADIUS_KM)
        * math.cos(initial_latitude),
        math.cos(distance / EARTH_RADIUS_KM)
        - math.sin(initial_latitude) * math.sin(final_latitude),
    )

    final_latitude = to_degrees(final_latitude)
    final_longitude = to_degrees(final_longitude)

    return [final_latitude, final_longitude]


def random_float(min_value: float, max_value: float) -> float:
    return random.uniform(min_value, max_value)


def random_int(min_value: int, max_value: int) -> int:
    return random.randint(min_value, max_value)


def get_next_coordinates(
    origin_latitude: float,
    origin_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
    platform_speed: float,
) -> List[float]:
    heading = get_bearing_between_two_points(
        origin_latitude, origin_longitude, destination_latitude, destination_longitude
    )
    total_distance = get_distance_between_two_points(
        origin_latitude, origin_longitude, destination_latitude, destination_longitude
    )
    total_time_hours = (total_distance * KILOMETERS_TO_NAUTICAL_MILES) / (
        platform_speed if platform_speed >= 0 else -platform_speed
    )
    total_time_seconds = math.floor(total_time_hours * 3600)
    leg_distance = total_distance / total_time_seconds

    return get_terminal_coordinates_from_distance_and_bearing(
        origin_latitude, origin_longitude, leg_distance, heading
    )

def to_camelcase(s):
    return re.sub(r'(?!^)_([a-zA-Z])', lambda m: m.group(1).upper(), s)