import json
import uuid
import random
import time
import argparse


def generate_route(lat, lon, num_waypoints=3, max_offset=1.0):
    """Generate a simple route with random waypoints around the given lat/lon."""
    return [
        [
            lat + random.uniform(-max_offset, max_offset),
            lon + random.uniform(-max_offset, max_offset),
        ]
        for _ in range(num_waypoints)
    ]


def create_weapon(side_id: str, color: str, base_lat: float, base_lon: float) -> dict:
    """Factory for a single weapon."""
    return {
        "id": str(uuid.uuid4()),
        "name": "Test Weapon",
        "sideId": side_id,
        "className": "Test Weapon",
        "latitude": base_lat,
        "longitude": base_lon,
        "altitude": 0,
        "heading": random.uniform(0, 360),
        "speed": random.uniform(100, 1000),
        "currentFuel": 0,
        "maxFuel": 0,
        "fuelRate": 0,
        "range": random.uniform(10, 100),
        "route": [],
        "sideColor": color,
        "targetId": None,
        "lethality": random.uniform(0.1, 1),
        "maxQuantity": random.randint(1, 100),
        "currentQuantity": random.randint(1, 100),
    }


def generate_scenario(num_sides: int, units_per_side: int) -> dict:
    timestamp = int(time.time())
    scenario = {
        "currentScenario": {
            "id": str(uuid.uuid4()),
            "name": "Load Test Scenario",
            "startTime": timestamp,
            "currentTime": timestamp,
            "duration": 14400,
            "sides": [],
            "timeCompression": 1,
            "aircraft": [],
            "ships": [],
            "facilities": [],
            "airbases": [],
            "referencePoints": [],
            "weapons": [],
            "missions": [],
            "relationships": {"hostiles": {}, "allies": {}},
        },
        "currentSideId": "",
        "selectedUnitId": "",
        "mapView": {
            "defaultCenter": [0, 0],
            "currentCameraCenter": [0, 0],
            "defaultZoom": 5,
            "currentCameraZoom": 5,
        },
    }

    colors = ["red", "blue", "green", "yellow", "white", "black"]
    for i in range(1, num_sides + 1):
        side_id = str(uuid.uuid4())
        color = colors[i % len(colors)]
        scenario["currentScenario"]["sides"].append(
            {"id": side_id, "name": str(i), "totalScore": 0, "color": color}
        )
        scenario["currentScenario"]["relationships"]["hostiles"][side_id] = []
        scenario["currentScenario"]["relationships"]["allies"][side_id] = []

        for j in range(units_per_side):
            idx = f"{i}-{j}"
            # Random base coordinates
            lat = random.uniform(-90, 90)
            lon = random.uniform(-180, 180)

            # Aircraft
            aircraft = {
                "id": str(uuid.uuid4()),
                "name": f"Aircraft {idx}",
                "sideId": side_id,
                "className": "Test Aircraft",
                "latitude": lat,
                "longitude": lon,
                "altitude": random.randint(1000, 30000),
                "heading": random.uniform(0, 360),
                "speed": random.uniform(200, 600),
                "currentFuel": random.uniform(1000, 5000),
                "maxFuel": 5000,
                "fuelRate": random.uniform(100, 500),
                "range": random.uniform(200, 2000),
                "route": generate_route(lat, lon),
                "selected": False,
                "sideColor": color,
                "weapons": [create_weapon(side_id, color, lat, lon)],
            }
            scenario["currentScenario"]["aircraft"].append(aircraft)

            # Ship
            ship_lat = lat + 0.1
            ship_lon = lon + 0.1
            ship = {
                "id": str(uuid.uuid4()),
                "name": f"Ship {idx}",
                "sideId": side_id,
                "className": "Test Ship",
                "latitude": ship_lat,
                "longitude": ship_lon,
                "altitude": 0,
                "heading": random.uniform(0, 360),
                "speed": random.uniform(10, 30),
                "currentFuel": random.uniform(10000, 50000),
                "maxFuel": 50000,
                "fuelRate": random.uniform(1000, 5000),
                "range": random.uniform(100, 1000),
                "route": generate_route(ship_lat, ship_lon),
                "selected": False,
                "sideColor": color,
                "weapons": [create_weapon(side_id, color, ship_lat, ship_lon)],
                "aircraft": [],
            }
            scenario["currentScenario"]["ships"].append(ship)

            # Facility (SAM)
            facility_lat = lat + 0.2
            facility_lon = lon + 0.2
            facility = {
                "id": str(uuid.uuid4()),
                "name": f"SAM {idx}",
                "sideId": side_id,
                "className": "Test SAM",
                "latitude": facility_lat,
                "longitude": facility_lon,
                "altitude": 0,
                "range": random.uniform(50, 300),
                "sideColor": color,
                "weapons": [create_weapon(side_id, color, facility_lat, facility_lon)],
            }
            scenario["currentScenario"]["facilities"].append(facility)

            # Airbase
            airbase_lat = lat + 0.3
            airbase_lon = lon + 0.3
            airbase = {
                "id": str(uuid.uuid4()),
                "name": f"Airbase {idx}",
                "sideId": side_id,
                "className": "Test Airbase",
                "latitude": airbase_lat,
                "longitude": airbase_lon,
                "altitude": 0,
                "sideColor": color,
                "aircraft": [],
            }
            scenario["currentScenario"]["airbases"].append(airbase)

            # Reference Point
            ref_lat = lat + 0.4
            ref_lon = lon + 0.4
            reference_point = {
                "id": str(uuid.uuid4()),
                "name": f"ReferencePoint {idx}",
                "sideId": side_id,
                "latitude": ref_lat,
                "longitude": ref_lon,
                "altitude": 0,
                "sideColor": color,
            }
            scenario["currentScenario"]["referencePoints"].append(reference_point)

    # Set currentSideId to first side
    if scenario["currentScenario"]["sides"]:
        scenario["currentSideId"] = scenario["currentScenario"]["sides"][0]["id"]

    return scenario


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate load-test scenario JSON")
    parser.add_argument(
        "-s", "--sides", type=int, default=1, help="Number of sides to generate"
    )
    parser.add_argument(
        "-u", "--units", type=int, default=500, help="Number of each unit type per side"
    )
    args = parser.parse_args()

    scenario = generate_scenario(args.sides, args.units)
    with open("load_test_scenario.json", "w") as f:
        json.dump(scenario, f, indent=2)
    print(
        f"Scenario with {args.sides} sides and {args.units} units per side written to load_test_scenario.json"
    )
