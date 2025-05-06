export enum DoctrineType {
  AIRCRAFT_ATTACK_HOSTILE = "Aircraft attack hostile",
  AIRCRAFT_CHASE_HOSTILE = "Aircraft chase hostile",
  AIRCRAFT_RTB_WHEN_OUT_OF_RANGE = "Aircraft RTB when out of range of homebase",
  AIRCRAFT_RTB_WHEN_STRIKE_MISSION_COMPLETE = "Aircraft RTB when strike mission complete",
  SAM_ATTACK_HOSTILE = "SAMs attack hostile",
  SHIP_ATTACK_HOSTILE = "Ships attack hostile",
}

export interface SideDoctrine {
  [DoctrineType.AIRCRAFT_ATTACK_HOSTILE]: boolean;
  [DoctrineType.AIRCRAFT_CHASE_HOSTILE]: boolean;
  [DoctrineType.AIRCRAFT_RTB_WHEN_OUT_OF_RANGE]: boolean;
  [DoctrineType.AIRCRAFT_RTB_WHEN_STRIKE_MISSION_COMPLETE]: boolean;
  [DoctrineType.SAM_ATTACK_HOSTILE]: boolean;
  [DoctrineType.SHIP_ATTACK_HOSTILE]: boolean;
}

export default interface Doctrine {
  [sideId: string]: SideDoctrine;
}
