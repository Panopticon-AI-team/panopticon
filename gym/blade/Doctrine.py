from enum import Enum
from typing import TypedDict, Dict


class DoctrineType(str, Enum):
    AIRCRAFT_ATTACK_HOSTILE = "Aircraft attack hostile aircraft"
    AIRCRAFT_CHASE_HOSTILE = "Aircraft chase hostile aircraft"
    AIRCRAFT_RTB_WHEN_OUT_OF_RANGE = "Aircraft RTB when out of range of homebase"
    AIRCRAFT_RTB_WHEN_STRIKE_MISSION_COMPLETE = "Aircraft RTB when strike mission complete"
    SAM_ATTACK_HOSTILE = "SAMs attack hostile aircraft"
    SHIP_ATTACK_HOSTILE = "Ships attack hostile aircraft"


class SideDoctrine(TypedDict):
    AIRCRAFT_ATTACK_HOSTILE: bool
    AIRCRAFT_CHASE_HOSTILE: bool
    AIRCRAFT_RTB_WHEN_OUT_OF_RANGE: bool
    AIRCRAFT_RTB_WHEN_STRIKE_MISSION_COMPLETE: bool
    SAM_ATTACK_HOSTILE: bool
    SHIP_ATTACK_HOSTILE: bool


Doctrine = Dict[str, SideDoctrine]
