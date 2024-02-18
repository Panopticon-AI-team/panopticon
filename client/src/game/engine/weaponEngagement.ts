import { v4 as uuidv4 } from "uuid";
import { Projection, fromLonLat } from "ol/proj"
import { DEFAULT_OL_PROJECTION_CODE, NAUTICAL_MILES_TO_METERS } from "../../utils/constants"
import Aircraft from "../units/Aircraft"
import Facility from "../units/Facility"
import { Circle } from "ol/geom"
import Scenario from "../Scenario"
import Weapon from "../units/Weapon"
import { generateRoute, getBearingBetweenTwoPoints, randomFloat } from "../../utils/utils"

export function checkIfAircraftIsWithinFacilityThreatRange(aircraft: Aircraft, facility: Facility): boolean {
    const projection = new Projection({code: DEFAULT_OL_PROJECTION_CODE})
    const facilityRangeGeometry = new Circle(fromLonLat([facility.longitude, facility.latitude], projection), facility.range * NAUTICAL_MILES_TO_METERS)
    return facilityRangeGeometry.intersectsCoordinate(fromLonLat([aircraft.longitude, aircraft.latitude], projection))
}

export function weaponEndgame(currentScenario: Scenario, weapon: Weapon, target: Aircraft | Facility | Weapon): boolean {
    currentScenario.weapons = currentScenario.weapons.filter((currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id);
    if (randomFloat() <= weapon.lethality) {
        if (target instanceof Aircraft) {
            currentScenario.aircraft = currentScenario.aircraft.filter((currentScenarioAircraft) => currentScenarioAircraft.id !== target.id);
        } else if (target instanceof Facility) {
            currentScenario.facilities = currentScenario.facilities.filter((currentScenarioFacility) => currentScenarioFacility.id !== target.id)
        } else if (target instanceof Weapon) {
            currentScenario.weapons = currentScenario.weapons.filter((currentScenarioWeapon) => currentScenarioWeapon.id !== target.id)
        }
        return true
    }
    return false
}

export function launchWeapon(currentScenario: Scenario, origin: Aircraft | Facility, target: Aircraft | Facility | Weapon) {
    if (origin.weapons.length === 0) return

    const numberOfWaypoints = 10
    const weaponPrototype = origin.weapons[0]
    const newWeapon = new Weapon({
        id: uuidv4(), 
        name: weaponPrototype.name, 
        sideName: origin.sideName, 
        className: weaponPrototype.className,
        latitude: weaponPrototype.latitude,
        longitude: weaponPrototype.longitude,
        altitude: weaponPrototype.altitude,
        heading: getBearingBetweenTwoPoints(origin.latitude, origin.longitude, target.latitude, target.longitude),
        speed: weaponPrototype.speed,
        fuel: weaponPrototype.fuel,
        range: weaponPrototype.range,
        route: generateRoute(origin.latitude, origin.longitude, target.latitude, target.longitude, numberOfWaypoints),
        sideColor: weaponPrototype.sideColor,
        targetId: target.id,
        lethality: weaponPrototype.lethality,
        maxQuantity: weaponPrototype.maxQuantity,
        currentQuantity: weaponPrototype.currentQuantity,
    });
    currentScenario.weapons.push(newWeapon);
    origin.weapons[0].currentQuantity -= 1
    if (origin.weapons[0].currentQuantity < 1) origin.weapons.shift()
}

export function weaponEngagement(currentScenario: Scenario, weapon: Weapon) {
    const target = currentScenario.getAircraft(weapon.targetId) ?? currentScenario.getFacility(weapon.targetId) ?? currentScenario.getWeapon(weapon.targetId);
    if (target) {
        const weaponRoute = weapon.route;
        if (weapon.route.length === 2) {
            weaponEndgame(currentScenario, weapon, target)
        } else if (weaponRoute.length > 0) {
            const nextWaypoint = weaponRoute[0];
            weapon.route = generateRoute(nextWaypoint[0], nextWaypoint[1], target.latitude, target.longitude, weaponRoute.length > 0 ? weaponRoute.length - 1 : 0);
            weapon.heading = getBearingBetweenTwoPoints(weapon.latitude, weapon.longitude, target.latitude, target.longitude);
        }
    } else {
        currentScenario.weapons = currentScenario.weapons.filter((currentScenarioWeapon) => currentScenarioWeapon.id !== weapon.id)
    }
}
