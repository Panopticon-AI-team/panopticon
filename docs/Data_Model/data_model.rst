Observations Data Types
=======================
The Gymnasium environment exposes observations that are defined by the Scenario class at each timestep. 
This class contains parameters like the scenario's name, start time, duration, sides, current time, simulation speed (called time compression), aircraft, ships, facilities, airbases, weapons, reference points, and missions. 
Observations are exportable to a JSON file that can be uploaded to the web application for visualization.

Scenario
--------

Represents the entire scenario at a simulation timestep (defined by currentTime).

Attributes
^^^^^^^^^^^

- ``id``: (str) unique identifier for the scenario.

    - ``Example``: "6806c96b-14f8-4c52-ba60-c6d24e238a17"

- ``name``: (str) name of the scenario.

    - ``Example``: "Test Scenario"

- ``startTime``: (int) start time of the scenario in Unix timestamp format.

    - ``Example``: 1699073110

- ``currentTime``: (int) current time in the scenario in Unix timestamp format.

    - ``Example``: 1699073110

- ``duration``: (int) total duration of the scenario in seconds.

    - ``Example``: 14400

- ``timeCompression``: (int) the speed at which the simulation runs.

- ``sides``: (list[Side]) describes the different sides involved in the scenario (e.g., BLUE, RED).

- ``aircraft``: (list[Aircraft]) list of aircraft in the scenario.

- ``ships``: (list[Ship]) list of ships in the scenario.

- ``facilities``: (list[Facility]) list of facilities (e.g. SAMs) in the scenario.

- ``airbases``: (list[Airbase]) list of airbases in the scenario.

- ``weapons``: (list[Weapon]) list of weapons that are currently deployed/fired in the scenario.

- ``referencePoints``: (list[ReferencePoint]) list of reference points that are currently in the scenario.

- ``missions``: (list[PatrolMission | StrikeMission]) list of missions that are in the scenario.

- ``relationships``: (Relationships) relationships between the sides in the scenario. Determines whether sides are allies or enemies.

- ``doctrine``: (Doctrine) doctrine that defines the behavior of the sides in the scenario.

Methods
^^^^^^^

- ``toJSON()``: (str) returns this object as a JSON.


Side
----
This class describes the different sides involved in the scenario (e.g., BLUE, RED).

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the side.

    - Example: "47179c9e-aa00-4bba-a784-cec9108fdb4b"

- ``name``: (str) name of the side.

    - Example: "BLUE"

- ``totalScore``: (int) total score of the side.

    - Example: 0

- ``sideColor``: (str) color representing the side.

    - Example: "blue"

Methods
^^^^^^^


- ``toJSON()``: (str) returns this object as a JSON.

Airbase
-------
This class describes an airbase, primarily used for housing aircraft.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the side.

    - Example: "47179c9e-aa00-4bba-a784-cec9108fdb4b"

- ``name``: (str) name of the side.

    - Example: "BLUE"

- ``sideName``: (str) side to which airbase belongs.

- ``sideColor``: (str) the color of the airbase's current side.

- ``className``: (str) type of airbase.

- ``latitude``: (float) latitude position.

- ``longitude``: (float) longitude position.

- ``altitude``: (float) altitude in feet.

- ``aircraft``: (list[Aircraft]) list of aircraft housed at the airbase.

Methods
^^^^^^^


- ``toJSON()``: (str) returns this object as a JSON.


Aircraft
--------
This class describes an aircraft.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the aircraft.

    - Example: "7bc96d3b-ffe7-4469-b976-893e7fa5deca"

- ``name``: (str) name/Callsign of the aircraft.

    - Example: "Beaver #1"

- ``sideName``: (str) side to which the aircraft belongs (e.g., BLUE, RED).

    - Example: "BLUE"

- ``sideColor``: (str) the color of the aircraft's current side.

- ``selected``: (bool) whether the unit is currently selected.

- ``className``: (str) type of the aircraft.

    - Example: "F-16C"

- ``latitude``: (float) latitude position.

    - Example: 20.442558487173827

- ``longitude``: (float) longitude position.

    - Example: 144.16072045098306

- ``altitude``: (float) altitude in feet.

    - Example: 10000

- ``heading``: (float) heading in degrees.

    - Example: 85.42632327325884

- ``speed``: (float) speed in knots.

    - Example: 350

- ``currentFuel``: (float) remaining fuel.

    - Example: 100000

- ``maxFuel``: (float) maximum fuel capacity.

    - Example: 100000

- ``fuelRate``: (float) the fuel consumption in lbs/hr.

- ``weapons``: (list[Weapon]) list of weapons the aircraft has.

- ``range``: (float) the aircraft's maximum range.

- ``route``: (list[list[float]]) the aircraft's current route (collection of waypoints).

- ``homeBaseId``: (str) the identifier of the aircraft's home base.

- ``rtb``: (bool) whether or not the aircraft is returning to base.

- ``targetId``: (str) the identifier of the aircraft's current target.

Methods
^^^^^^^


- ``getTotalWeaponQuantity()``: (int) returns the aircraft's current count of weapons.

- ``getWeaponWithHighestRange()``: (int) returns the aircraft's highest range weapon.

- ``toJSON()``: (str) returns this object as a JSON.


Facility
--------
This class describes a facility, which is usually used to represent a surface to air missile (SAM).

Attributes
^^^^^^^^^^
- ``id``: (str) Unique identifier for the facility.

    - Example: "8dd38f74-7e04-446f-94c7-5f5f82157d49"

- ``name``: (str) name of the facility.

    - Example: "SAM #1"

- ``sideName``: (str) side to which the unit belongs (e.g., BLUE, RED).

    - Example: "BLUE"

- ``sideColor``: (str) the color of the unit's current side.

- ``className``: (str) type of facility.

- ``latitude``: (float) latitude position.

    - Example: 20.442558487173827

- ``longitude``: (float) longitude position.

    - Example: 144.16072045098306

- ``altitude``: (float) altitude in feet.

    - Example: 10000

- ``range``: (float) range of the facility's weapons in nautical miles.

    - Example: 250

- ``weapons``: (list[Weapon]) list of weapons the facility has.

Methods
^^^^^^^


- ``getTotalWeaponQuantity()``: (int) returns the facility's current count of weapons.

- ``getWeaponWithHighestRange()``: (int) returns the facility's highest range weapon.

- ``toJSON()``: (str) returns this object as a JSON.

Reference Point
---------------
This class describes a reference point that can be used to define areas for missions.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the reference point.

    - Example: "f2c69876-986f-4eb2-aa09-da00125e0e09"

- ``name``: (str) name or designation of the reference point.

    - Example: "Reference Point #1175"

- ``sideName``: (str) side to which the reference point belongs (e.g., BLUE, RED).

    - Example: "BLUE"

- ``sideColor``: (str) color representing the side associated with the reference point.

    - Example: "blue"

- ``latitude``: (float) latitude coordinate of the reference point.

    - Example: 21.800061432629548

- ``longitude``: (float) longitude coordinate of the reference point.

    - Example: 149.8482617352473

- ``altitude``: (float) altitude of the reference point (usually 0 if it's a ground-based point).

    - Example: 0

Methods
^^^^^^^


- ``toJSON()``: (str) returns this object as a JSON.


Ship
----
This class describes a ship, which can move and also house aircraft.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the ship.

    - Example: "7bc96d3b-ffe7-4469-b976-893e7fa5deca"

- ``name``: (str) name/callsign of the ship.

    - Example: "Carrier #4201"

- ``sideName``: (str) side to which the ship belongs (e.g., BLUE, RED).

    - Example: "BLUE"

- ``sideColor``: (str) the color of the ship's current side.

- ``selected``: (bool) whether the unit is currently selected.

- ``className``: (str) type of the ship.

    - Example: "Carrier"

- ``latitude``: (float) latitude position.

    - Example: 20.442558487173827

- ``longitude``: (float) longitude position.

    - Example: 144.16072045098306

- ``altitude``: (float) altitude in feet.

    - Example: 10000

- ``heading``: (float) heading in degrees.

    - Example: 85.42632327325884

- ``speed``: (float) speed in knots.

    - Example: 350

- ``currentFuel``: (float) remaining fuel.

    - Example: 100000

- ``maxFuel``: (float) maximum fuel capacity.
    - Example: 100000

- ``fuelRate``: (float) the fuel consumption in lbs/hr.

- ``range``: (float) the maximum range of the ship's weapons.

- ``route``: (list[list[float]]) the ship's current route (collection of waypoints).

- ``weapons``: (list[Weapon]) list of weapons the ship has.

- ``aircraft``: (list[Aircraft]) list of aircraft housed at the ship.

Methods
^^^^^^^


- ``getTotalWeaponQuantity()``: (int) returns the ship's current count of weapons.

- ``getWeaponWithHighestRange()``: (int) returns the ship's highest range weapon.

- ``toJSON()``: (str) returns this object as a JSON.

Weapon
------
This class describes a weapon, usually used to define a missile.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the weapon.

    - Example: "c9065bb1-4b3a-41d5-bc91-a16bdb23881c"

- ``name``: (str) name of the weapon.

    - Example: "Sample Weapon"

- ``sideName``: (str) side to which the weapon belongs (e.g., BLUE, RED).

    - Example: "BLUE"

- ``sideColor``: (str) the color of the weapon's current side.

- ``className``: (str) type of weapon.

    - Example: "AGM-158"

- ``latitude``: (float) latitude position.

    - Example: 20.442558487173827

- ``longitude``: (float) longitude position.

    - Example: 144.16072045098306

- ``altitude``: (float) altitude in feet.

    - Example: 10000

- ``heading``: (float) heading in degrees.

    - Example: 85.42632327325884

- ``speed``: (float) speed in knots.

    - Example: 350

- ``currentFuel``: (float) remaining fuel.

    - Example: 100000

- ``maxFuel``: (float) maximum fuel capacity.

    - Example: 100000

- ``fuelRate``: (float) the fuel consumption in lbs/hr.

- ``range``: (float) the weapon's maximum range.

- ``route``: (list[list[float]]) the weapon's current route (collection of waypoints).

- ``targetId``: (str) the identifier of the weapon's current target.

- ``lethality``: (float) lethality score of the weapon. Used to calculate whether a hit target is destroyed.

    - Example: 0.25

- ``currentQuantity``: (int) number of available weapons.

    - Example: 10

- ``maxQuantity``: (int) maximum number of weapons.

    - Example: 10

Methods
^^^^^^^


- ``toJSON()``: (str) returns this object as a JSON.

Patrol Mission
--------------
This class describes a patrol mission where units randomly patrol a defined area.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the mission.

    - Example: "a8ab936c-184b-42bf-aa83-abca31bb2e73"

- ``name``: (str) name of the mission.

    - Example: "Andersen Patrol"

- ``sideId``: (str) the side that owns the mission.

    - Example: "BLUE"

- ``assignedUnitIds``: (list[str]) list of unit IDs assigned to the mission.

    - Example: ["7bc96d3b-ffe7-4469-b976-893e7fa5deca", "46e0ab0f-b49c-4961-b265-ce93dd163c21"]

- ``assignedArea``: (list[ReferencePoint]) geographical coordinates that define the patrol or mission area.

    - Example: [[21.800061432629548, 149.8482617352473], [14.753441339796368, 150.96692676017133]]

- ``active``: (bool) whether the mission is active.

Methods
^^^^^^^


- ``checkIfCoordinatesIsWithinPatrolArea(coordinates``: list[float]): (bool) returns true if the input coordinates is within the mission's patrol area.

- ``generateRandomCoordinatesWithinPatrolArea()``: (list[float]) generates a random waypoint within the patrol area.

- ``toJSON()``: (str) returns this object as a JSON.

Strike Mission
--------------
This class describes a strike mission where a group of attackers strike a group of targets.

Attributes
^^^^^^^^^^
- ``id``: (str) unique identifier for the mission.

    - Example: "a8ab936c-184b-42bf-aa83-abca31bb2e73"

- ``name``: (str) name of the mission.

    - Example: "Liaoning Strike"

- ``sideId``: (str) the side that owns the mission.

    - Example: "BLUE"

- ``assignedUnitIds``: (list[str]) list of unit IDs assigned to the mission.

    - Example: ["7bc96d3b-ffe7-4469-b976-893e7fa5deca", "46e0ab0f-b49c-4961-b265-ce93dd163c21"]

- ``assignedTargetIds``: (list[str]) list of target IDs.

    - Example: ["7bc96d3b-ffe7-4469-b976-893e7fa5deca", "46e0ab0f-b49c-4961-b265-ce93dd163c21"]

- ``active``: (bool) whether the mission is active.

Methods
^^^^^^^

- ``toJSON()``: (str) returns this object as a JSON.

Relationships
--------------
This class describes relationships between sides in the scenario, determining whether sides are allies or enemies.

Attributes
^^^^^^^^^^
- ``hostiles``: (Dict[str, List[str]]) a map containing each side's hostiles.

    - Example: {"12345678-1234-5678-1234-567812345678": ["87654321-4321-4321-4321-123456789012"]}

- ``allies``: (Dict[str, List[str]]) a map containing each side's allies.

    - Example: {"12345678-1234-5678-1234-567812345678": ["87654321-4321-4321-4321-123456789012"]}

Doctrine
--------------
This class describes the doctrine that defines the behavior of the sides in the scenario.

Attributes
^^^^^^^^^^
- ``AIRCRAFT_ATTACK_HOSTILE``: (bool) whether aircraft will attack hostile units.

- ``AIRCRAFT_CHASE_HOSTILE``: (bool) whether aircraft will chase hostile units.

- ``AIRCRAFT_RTB_WHEN_OUT_OF_RANGE``: (bool) whether aircraft will return to base when out of range of their target.

- ``AIRCRAFT_RTB_WHEN_STRIKE_MISSION_COMPLETE``: (bool) whether aircraft will return to base when a strike mission is complete.

- ``SAM_ATTACK_HOSTILE``: (bool) whether surface-to-air missiles (SAMs) will attack hostile units.

- ``SHIP_ATTACK_HOSTILE``: (bool) whether ships will attack hostile units.

Actions Data Types
==================

BLADE's action space is defined by the functions provided by the Game class that modifies the underlying simulation. 
These actions can be invoked by an agent as strings. For example, to direct an aircraft with an ID of 1 to transit to the coordinates 
(10, 10), pass the string move_aircraft(1, 10, 10) as an action into the Gymnasium environment.

- add_reference_point(reference_point_name: str, latitude: float, longitude: float): adds a reference point with the specified name at the specified coordinates.

- remove_reference_point(reference_point_id: str): removes a reference point.

- launch_aircraft_from_airbase(airbase_id: str): launch an aircraft from an airbase.

- launch_aircraft_from_ship(ship_id: str): launch an aircraft from a ship

- create_patrol_mission(mission_name: str, assigned_units: list[str], assigned_area: list[list[float]]): creates a patrol mission.

- update_patrol_mission(mission_id: str, mission_name: str, assigned_units: list[str], assigned_area: list[list[float]]): updates a patrol mission with new parameters.

- create_strike_mission(mission_name: str, assigned_attackers: list[str], assigned_targets: list[str]): creates a strike mission.

- update_strike_mission(mission_id: str, mission_name: str, assigned_attackers: list[str], assigned_targets: list[str]): updates a strike mission with new parameters.

- delete_mission(mission_id: str): deletes a mission.

- move_aircraft(aircraft_id: str, new_coordinates: list): direct an aircraft to transit to a waypoint

- move_ship(ship_id: str, new_coordinates: list): direct a ship to transit to a waypoint.

- handle_aircraft_attack(aircraft_id: str, target_id: str): launches a weapon from an aircraft to a target.

- handle_ship_attack(ship_id: str, target_id: str): launches a weapon from a ship to a target.

- aircraft_return_to_base(aircraft_id: str): direct an aircraft to return to its home base or the nearest base.

- land_aircraft(aircraft_id: str): lands an aircraft at its home base or nearest base.