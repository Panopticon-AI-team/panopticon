from blade.units.Aircraft import Aircraft
from blade.units.Weapon import Weapon

from typing import TypedDict, List
try:
    from typing import NotRequired
except ImportError:
    from typing_extensions import NotRequired

class AircraftUpdate(TypedDict):
    id: str
    name: NotRequired[str]
    className: NotRequired[str]
    latitude: NotRequired[float]
    longitude: NotRequired[float]
    altitude: NotRequired[float]
    heading: NotRequired[float]
    speed: NotRequired[float]
    currentFuel: NotRequired[float]
    maxFuel: NotRequired[float]
    fuelRate: NotRequired[float]
    range: NotRequired[float]
    route: NotRequired[List[List[float]]]    
    weapons: NotRequired[List[Weapon]]
    rtb: NotRequired[bool]
    targetId: NotRequired[str]


class ShipUpdate(TypedDict):
    id: str
    name: NotRequired[str]
    className: NotRequired[str]
    latitude: NotRequired[float]
    longitude: NotRequired[float]
    altitude: NotRequired[float]
    heading: NotRequired[float]
    speed: NotRequired[float]
    currentFuel: NotRequired[float]
    maxFuel: NotRequired[float]
    fuelRate: NotRequired[float]
    range: NotRequired[float]
    route: NotRequired[List[List[float]]]
    weapons: NotRequired[List[Weapon]]
    aircraft: NotRequired[List[Aircraft]]

class WeaponUpdate(TypedDict):
    id: str
    name: NotRequired[str]
    className: NotRequired[str]
    latitude: NotRequired[float]
    longitude: NotRequired[float]
    altitude: NotRequired[float]
    heading: NotRequired[float]
    speed: NotRequired[float]
    currentFuel: NotRequired[float]
    maxFuel: NotRequired[float]
    fuelRate: NotRequired[float]
    range: NotRequired[float]
    route: NotRequired[List[List[float]]]
    targetId: NotRequired[str]

class AirbaseUpdate(TypedDict):
    id: str
    name: NotRequired[str]
    latitude: NotRequired[float]
    longitude: NotRequired[float]
    altitude: NotRequired[float]
    aircraft: NotRequired[List[Aircraft]]

class FacilityUpdate(TypedDict):
    id: str
    name: NotRequired[str]
    className: NotRequired[str]
    latitude: NotRequired[float]
    longitude: NotRequired[float]
    altitude: NotRequired[float]
    range: NotRequired[float]
    weapons: NotRequired[List[Weapon]]

class ReferencePointUpdate(TypedDict):
    id: str
    name: NotRequired[str]
    latitude: NotRequired[float]
    longitude: NotRequired[float]
    altitude: NotRequired[float]