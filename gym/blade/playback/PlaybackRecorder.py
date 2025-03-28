import gzip
import json
from math import isclose

from blade.playback.UpdateUnitTypes import (
    AircraftUpdate, ShipUpdate, WeaponUpdate,
    AirbaseUpdate, FacilityUpdate, ReferencePointUpdate
    )

from blade.units.Aircraft import Aircraft
from blade.units.Airbase import Airbase
from blade.units.Facility import Facility
from blade.units.Ship import Ship
from blade.units.Weapon import Weapon
from blade.units.ReferencePoint import ReferencePoint
from blade.Scenario import Scenario
from blade.units.ReducedScenarioEncoder import ReducedScenarioEncoder

from typing import Any, Dict, TypedDict, List, Optional
try:
    from typing import NotRequired
except ImportError:
    from typing_extensions import NotRequired
    
FLOAT_PRECISION = 3

class RecordingInfo(TypedDict):
    name: str
    scenarioId: str
    scenarioName: str
    startTime: int
'''
class Step(TypedDict):
    currentTime: int
    aircraft: List[Aircraft]
    ships: List[Ship]
    facilities: List[Facility]
    airbases: List[Airbase]
    weapons: List[Weapon]
    referencePoints: List[ReferencePoint]
'''
class Change(TypedDict):
    currentTime: int
    
    newAircraft: NotRequired[List[Aircraft]]
    deletedAircraftIds: NotRequired[List[str]]
    aircraftUpdates: NotRequired[List[AircraftUpdate]]
    
    newShips: NotRequired[List[Ship]]
    deletedShipIds: NotRequired[List[str]]
    shipUpdates: NotRequired[List[ShipUpdate]]
    
    newWeapons: NotRequired[List[Weapon]]
    deletedWeaponIds: NotRequired[List[str]]
    weaponUpdates: NotRequired[List[WeaponUpdate]]
    
    newAirbases: NotRequired[List[Airbase]]
    deletedAirbaseIds: NotRequired[List[str]]
    airbaseUpdates: NotRequired[List[AirbaseUpdate]]
    
    newFacilities: NotRequired[List[Facility]]
    deletedFacilityIds: NotRequired[List[str]]
    facilityUpdates: NotRequired[List[FacilityUpdate]]
    
    newReferencePoints: NotRequired[List[ReferencePoint]]
    deletedReferencePointIds: NotRequired[List[str]]
    referencePointUpdates: NotRequired[List[ReferencePointUpdate]]
    
class PlaybackRecorder:
    def __init__(self) -> None:
        self.recording_info: Optional[RecordingInfo] = None
        self.recorded_steps: List[Change] = []
        self.previous_step: Optional[Scenario] = None

    def reset(self) -> None:
        self.recording_info = None
        self.recorded_steps.clear()
        self.previous_step = None

    def start_recording(self, parameters: RecordingInfo, scenario: Scenario) -> None:
        self.reset()
        self.recording_info = parameters
        self.previous_step = scenario
        self.record_initial_frame(scenario)

    def record_initial_frame(self, scenario: Scenario) -> None:
        change: Change = {
            "currentTime": scenario.current_time,
            "newAircraft": scenario.aircraft,
            "newShips": scenario.ships,
            "newWeapons": scenario.weapons,
            "newAirbases": scenario.airbases,
            "newFacilities": scenario.facilities,
            "newReferencePoints": scenario.reference_points,
        }
        self.recorded_steps.append(change)
      
    def _write_recording(self, f) -> None:
        lines = []
        lines.append(json.dumps({"info": self.recording_info}, cls=ReducedScenarioEncoder))
        for step in self.recorded_steps:
            lines.append(json.dumps(step, cls=ReducedScenarioEncoder, separators=(',', ':')))
        f.write("\n".join(lines))

    def export_recording(self, tag = "", compression: bool = False) -> None:
        if not self.recording_info:
            print("No active recording to export.")
            return

        if compression:
            filename = f"{tag}_{self.recording_info['name']}.jsonl.gz"
            open_func = lambda fname: gzip.open(fname, "wt", encoding="utf-8")
        else:
            filename = f"{tag}_{self.recording_info['name']}.jsonl"
            open_func = lambda fname: open(fname, "w", encoding="utf-8")

        with open_func(filename) as f:
            self._write_recording(f)
        print(f"Recording exported to {filename}")
        
    def get_aircraft_changes(self, next_aircraft: List[Aircraft]) -> Change:
        prev_aircrafts = self.previous_step.aircraft if self.previous_step else []
        prev_ids = [ac.id for ac in prev_aircrafts]
        next_ids = [ac.id for ac in next_aircraft]

        new_aircraft = [ac for ac in next_aircraft if ac.id not in prev_ids]
        disabled_aircraft_ids = [ac.id for ac in prev_aircrafts if ac.id not in next_ids]
        updatable_aircraft = [ac for ac in next_aircraft if ac.id in prev_ids]
        
        aircraft_updates: List[AircraftUpdate] = []

        for aircraft in updatable_aircraft:
            prev_aircraft = next((x for x in prev_aircrafts if x.id == aircraft.id), None)
            if not prev_aircraft:
                continue

            update: AircraftUpdate = {"id": aircraft.id}
            
            if prev_aircraft.name != aircraft.name:
                update["name"] = aircraft.name
            if prev_aircraft.class_name != aircraft.class_name:
                update["className"] = aircraft.class_name
            if prev_aircraft.latitude != aircraft.latitude:
                update["latitude"] = round(aircraft.latitude, FLOAT_PRECISION)
            if prev_aircraft.longitude != aircraft.longitude:
                update["longitude"] = round(aircraft.longitude, FLOAT_PRECISION)
            if prev_aircraft.altitude != aircraft.altitude:
                update["altitude"] = round(aircraft.altitude, FLOAT_PRECISION)
            if prev_aircraft.heading != aircraft.heading:
                update["heading"] = round(aircraft.heading, FLOAT_PRECISION)
            if prev_aircraft.speed != aircraft.speed:
                update["speed"] = aircraft.speed
            # if prev_aircraft.current_fuel != aircraft.current_fuel:
            # doing this for all float values will bring file size down further
            if round(prev_aircraft.current_fuel, 3) != round(aircraft.current_fuel, 3):
                update["currentFuel"] = round(aircraft.current_fuel, FLOAT_PRECISION)
            if prev_aircraft.max_fuel != aircraft.max_fuel:
                update["maxFuel"] = round(aircraft.max_fuel, FLOAT_PRECISION)
            if prev_aircraft.fuel_rate != aircraft.fuel_rate:
                update["fuelRate"] = round(aircraft.fuel_rate, FLOAT_PRECISION)
            if prev_aircraft.range != aircraft.range:
                update["range"] = round(aircraft.range, FLOAT_PRECISION)
            if prev_aircraft.route != aircraft.route:
                route_rounded = [
                    [round(pt[0], FLOAT_PRECISION), round(pt[1], FLOAT_PRECISION)]
                    for pt in aircraft.route
                ]
                update["route"] = route_rounded
            if prev_aircraft.weapons != aircraft.weapons:
                update["weapons"] = aircraft.weapons  
            if prev_aircraft.rtb != aircraft.rtb:
                update["rtb"] = aircraft.rtb
            if prev_aircraft.target_id != aircraft.target_id:
                update["targetId"] = aircraft.target_id

            if len(update) > 2:  # means there's at least one changed field besides 'id'
                aircraft_updates.append(update)
        
        return {
            "newAircraft": new_aircraft,
            "deletedAircraftIds": disabled_aircraft_ids,
            "aircraftUpdates": aircraft_updates
        }

    def get_ship_changes(self, next_ships: list[Ship]) -> dict:
        previous_ships = self.previous_step.ships if self.previous_step else []
        prev_ids = [ship.id for ship in previous_ships]
        next_ids = [ship.id for ship in next_ships]

        new_ships = [ship for ship in next_ships if ship.id not in prev_ids]
        disabled_ship_ids = [ship.id for ship in previous_ships if ship.id not in next_ids]
        updatable_ships = [ship for ship in next_ships if ship.id in prev_ids]

        ship_updates: list[ShipUpdate] = []

        for current_ship in updatable_ships:
            previous_ship = next((sh for sh in previous_ships if sh.id == current_ship.id), None)
            if not previous_ship:
                continue

            update: ShipUpdate = {"id": current_ship.id}

            if previous_ship.name != current_ship.name:
                update["name"] = current_ship.name
            if previous_ship.class_name != current_ship.class_name:
                update["className"] = current_ship.class_name
            if previous_ship.latitude != current_ship.latitude:
                update["latitude"] = round(current_ship.latitude, FLOAT_PRECISION)
            if previous_ship.longitude != current_ship.longitude:
                update["longitude"] = round(current_ship.longitude, FLOAT_PRECISION)
            if previous_ship.altitude != current_ship.altitude:
                update["altitude"] = round(current_ship.altitude, FLOAT_PRECISION)
            if previous_ship.heading != current_ship.heading:
                update["heading"] = round(current_ship.heading, FLOAT_PRECISION)
            if previous_ship.speed != current_ship.speed:
                update["speed"] = current_ship.speed
            if round(previous_ship.current_fuel, FLOAT_PRECISION) != round(current_ship.current_fuel, FLOAT_PRECISION):
                update["currentFuel"] = round(current_ship.current_fuel, FLOAT_PRECISION)
            if previous_ship.max_fuel != current_ship.max_fuel:
                update["maxFuel"] = round(current_ship.max_fuel, FLOAT_PRECISION)
            if previous_ship.fuel_rate != current_ship.fuel_rate:
                update["fuelRate"] = round(current_ship.fuel_rate, FLOAT_PRECISION)
            if previous_ship.range != current_ship.range:
                update["range"] = round(current_ship.range, FLOAT_PRECISION)
            if previous_ship.route != current_ship.route:
                route = [[round(wp[0], FLOAT_PRECISION), round(wp[1], FLOAT_PRECISION)] for wp in current_ship.route]
                update["route"] = route
            if previous_ship.weapons != current_ship.weapons:
                update["weapons"] = current_ship.weapons
            if previous_ship.aircraft != current_ship.aircraft:
                update["aircraft"] = current_ship.aircraft

            if len(update) > 1:
                ship_updates.append(update)

        return {
            "newShips": new_ships,
            "deletedShipIds": disabled_ship_ids,
            "shipUpdates": ship_updates,
        }
        
        
    def get_weapon_changes(self, next_weapons: List[Weapon]) -> Dict[str, Any]:
        prev_weapons = self.previous_step.weapons if self.previous_step is not None else []
        prev_ids = [weapon.id for weapon in prev_weapons]
        next_ids = [weapon.id for weapon in next_weapons]

        new_weapons = [weapon for weapon in next_weapons if weapon.id not in prev_ids]
        disabled_weapon_ids = [weapon.id for weapon in prev_weapons if weapon.id not in next_ids]
        updatable_weapons = [weapon for weapon in next_weapons if weapon.id in prev_ids]
        
        weapon_updates: List[WeaponUpdate] = []

        for weapon in updatable_weapons:
            previous_weapon = next((wp for wp in prev_weapons if wp.id == weapon.id), None)
            if not previous_weapon:
                continue

            update: WeaponUpdate = {"id": weapon.id}

            if previous_weapon.name != weapon.name:
                update["name"] = weapon.name
            if previous_weapon.class_name != weapon.class_name:
                update["className"] = weapon.class_name
            if previous_weapon.latitude != weapon.latitude:
                update["latitude"] = round(weapon.latitude, FLOAT_PRECISION)
            if previous_weapon.longitude != weapon.longitude:
                update["longitude"] = round(weapon.longitude, FLOAT_PRECISION)
            if previous_weapon.altitude != weapon.altitude:
                update["altitude"] = round(weapon.altitude, FLOAT_PRECISION)
            if previous_weapon.heading != weapon.heading:
                update["heading"] = round(weapon.heading, FLOAT_PRECISION)
            if previous_weapon.speed != weapon.speed:
                update["speed"] = weapon.speed
            if previous_weapon.current_fuel != weapon.current_fuel:
                update["currentFuel"] = round(weapon.current_fuel, FLOAT_PRECISION)
            if previous_weapon.max_fuel != weapon.max_fuel:
                update["maxFuel"] = round(weapon.max_fuel, FLOAT_PRECISION)
            if previous_weapon.fuel_rate != weapon.fuel_rate:
                update["fuelRate"] = round(weapon.fuel_rate, FLOAT_PRECISION)
            if previous_weapon.range != weapon.range:
                update["range"] = round(weapon.range, FLOAT_PRECISION)
            if previous_weapon.route != weapon.route:
                route = [[round(waypoint[0], FLOAT_PRECISION), round(waypoint[1], FLOAT_PRECISION)] for waypoint in weapon.route]
                update["route"] = route
            if previous_weapon.target_id != weapon.target_id and weapon.target_id:
                update["targetId"] = weapon.target_id
                
            if len(update) > 1:
                weapon_updates.append(update)

        return {
            "newWeapons": new_weapons,
            "deletedWeaponIds": disabled_weapon_ids,
            "weaponUpdates": weapon_updates,
        }
        
    def get_airbase_changes(self, next_airbases: list[Airbase]) -> dict:
        previous_airbases = self.previous_step.airbases if self.previous_step else []
        prev_ids = [ab.id for ab in previous_airbases]
        next_ids = [ab.id for ab in next_airbases]

        new_airbases = [ab for ab in next_airbases if ab.id not in prev_ids]
        disabled_airbase_ids = [ab.id for ab in previous_airbases if ab.id not in next_ids]
        updated_airbases = [ab for ab in next_airbases if ab.id in prev_ids]

        airbase_updates: list[AirbaseUpdate] = []

        for airbase in updated_airbases:
            previous_ab = next((x for x in previous_airbases if x.id == airbase.id), None)
            if not previous_ab:
                continue

            update: AirbaseUpdate = {"id": airbase.id}

            if previous_ab.name != airbase.name:
                update["name"] = airbase.name
            if previous_ab.latitude != airbase.latitude:
                update["latitude"] = round(airbase.latitude, FLOAT_PRECISION)
            if previous_ab.longitude != airbase.longitude:
                update["longitude"] = round(airbase.longitude, FLOAT_PRECISION)
            if previous_ab.altitude != airbase.altitude:
                update["altitude"] = round(airbase.altitude, FLOAT_PRECISION)

            if len(update) > 1:
                airbase_updates.append(update)

        return {
            "newAirbases": new_airbases,
            "deletedAirbaseIds": disabled_airbase_ids,
            "airbaseUpdates": airbase_updates,
        }
        
    def get_facility_changes(self, next_facilities: list[Facility]) -> dict:
        previous_facilities = self.previous_step.facilities if self.previous_step else []
        prev_ids = [fa.id for fa in previous_facilities]
        next_ids = [fa.id for fa in next_facilities]

        new_facilities = [fa for fa in next_facilities if fa.id not in prev_ids]
        disabled_facility_ids = [fa.id for fa in previous_facilities if fa.id not in next_ids]
        updated_facilities = [fa for fa in next_facilities if fa.id in prev_ids]

        facility_updates: list[FacilityUpdate] = []

        for facility in updated_facilities:
            previous_fa = next((x for x in previous_facilities if x.id == facility.id), None)
            if not previous_fa:
                continue

            update: FacilityUpdate = {"id": facility.id}

            if previous_fa.name != facility.name:
                update["name"] = facility.name
            if previous_fa.class_name != facility.class_name:
                update["className"] = facility.class_name
            if previous_fa.latitude != facility.latitude:
                update["latitude"] = round(facility.latitude, FLOAT_PRECISION)
            if previous_fa.longitude != facility.longitude:
                update["longitude"] = round(facility.longitude, FLOAT_PRECISION)
            if previous_fa.altitude != facility.altitude:
                update["altitude"] = round(facility.altitude, FLOAT_PRECISION)
            if previous_fa.range != facility.range:
                update["range"] = round(facility.range, FLOAT_PRECISION)
            if previous_fa.weapons != facility.weapons:
                update["weapons"] = facility.weapons

            if len(update) > 1:
                facility_updates.append(update)

        return {
            "newFacilities": new_facilities,
            "deletedFacilityIds": disabled_facility_ids,
            "facilityUpdates": facility_updates,
        }


    def get_reference_point_changes(self, next_rps: list[ReferencePoint]) -> dict:
        previous_rps = self.previous_step.reference_points if self.previous_step else []
        prev_ids = [rp.id for rp in previous_rps]
        next_ids = [rp.id for rp in next_rps]

        new_rps = [rp for rp in next_rps if rp.id not in prev_ids]
        deleted_rp_ids = [rp.id for rp in previous_rps if rp.id not in next_ids]
        updated_rps = [rp for rp in next_rps if rp.id in prev_ids]

        rp_updates: list[ReferencePointUpdate] = []

        for rp in updated_rps:
            previous_rp = next((x for x in previous_rps if x.id == rp.id), None)
            if not previous_rp:
                continue

            update: ReferencePointUpdate = {"id": rp.id}

            if previous_rp.name != rp.name:
                update["name"] = rp.name
            if previous_rp.latitude != rp.latitude:
                update["latitude"] = round(rp.latitude, FLOAT_PRECISION)
            if previous_rp.longitude != rp.longitude:
                update["longitude"] = round(rp.longitude, FLOAT_PRECISION)
            if previous_rp.altitude != rp.altitude:
                update["altitude"] = round(rp.altitude, FLOAT_PRECISION)

            if len(update) > 1:
                rp_updates.append(update)

        return {
            "newReferencePoints": new_rps,
            "deletedReferencePointIds": deleted_rp_ids,
            "referencePointUpdates": rp_updates,
        }

    def record_frame(self, scenario: 'Scenario') -> None:
        if scenario is None:
            return
        
        aircraft_changes = self.get_aircraft_changes(scenario.aircraft)
        ship_changes = self.get_ship_changes(scenario.ships)
        weapon_changes = self.get_weapon_changes(scenario.weapons)
        airbase_changes = self.get_airbase_changes(scenario.airbases)
        facility_changes = self.get_facility_changes(scenario.facilities)
        rp_changes = self.get_reference_point_changes(scenario.reference_points)
        
        change: Change = {
            "currentTime": scenario.current_time
        }
        
        if aircraft_changes["newAircraft"]:
            change["newAircraft"] = aircraft_changes["newAircraft"]
        if aircraft_changes["deletedAircraftIds"]:
            change["deletedAircraftIds"] = aircraft_changes["deletedAircraftIds"]
        if aircraft_changes["aircraftUpdates"]:
            change["aircraftUpdates"] = aircraft_changes["aircraftUpdates"]

        if ship_changes["newShips"]:
            change["newShips"] = ship_changes["newShips"]
        if ship_changes["deletedShipIds"]:
            change["deletedShipIds"] = ship_changes["deletedShipIds"]
        if ship_changes["shipUpdates"]:
            change["shipUpdates"] = ship_changes["shipUpdates"]
                    
        if weapon_changes["newWeapons"]:
            change["newWeapons"] = weapon_changes["newWeapons"]
        if weapon_changes["deletedWeaponIds"]:
            change["deletedWeaponIds"] = weapon_changes["deletedWeaponIds"]
        if weapon_changes["weaponUpdates"]:
            change["weaponUpdates"] = weapon_changes["weaponUpdates"]
        
        if airbase_changes["newAirbases"]:
            change["newAirbases"] = airbase_changes["newAirbases"]
        if airbase_changes["deletedAirbaseIds"]:
            change["deletedAirbaseIds"] = airbase_changes["deletedAirbaseIds"]
        if airbase_changes["airbaseUpdates"]:
            change["airbaseUpdates"] = airbase_changes["airbaseUpdates"]

        if facility_changes["newFacilities"]:
            change["newFacilities"] = facility_changes["newFacilities"]
        if facility_changes["deletedFacilityIds"]:
            change["deletedFacilityIds"] = facility_changes["deletedFacilityIds"]
        if facility_changes["facilityUpdates"]:
            change["facilityUpdates"] = facility_changes["facilityUpdates"]

        if rp_changes["newReferencePoints"]:
            change["newReferencePoints"] = rp_changes["newReferencePoints"]
        if rp_changes["deletedReferencePointIds"]:
            change["deletedReferencePointIds"] = rp_changes["deletedReferencePointIds"]
        if rp_changes["referencePointUpdates"]:
            change["referencePointUpdates"] = rp_changes["referencePointUpdates"]

        if len(change) > 1:
            self.recorded_steps.append(change)
            
        self.previous_step = scenario

    """     
    def export_recording(self) -> None:
        if not self.recording_info:
            print("No active recording to export.")
            return

        recording = {
            "info": self.recording_info,
            "steps": self.recorded_steps,
        }
        
        for steps in recording["steps"]:
            if type(steps) is not dict:
                print(steps)

        filename = f"{self.recording_info['name']}.json.gz"
        with gzip.open(filename, "wt", encoding="utf-8") as f:
            json.dump(recording, f, cls=ReducedScenarioEncoder, indent=2)
        print(f"Recording exported to {filename}") 
    """