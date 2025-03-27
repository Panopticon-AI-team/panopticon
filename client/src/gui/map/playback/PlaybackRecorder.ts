import Scenario from "@/game/Scenario";
import Airbase from "@/game/units/Airbase";
import Aircraft from "@/game/units/Aircraft";
import Facility from "@/game/units/Facility";
import ReferencePoint from "@/game/units/ReferencePoint";
import Ship from "@/game/units/Ship";
import Weapon from "@/game/units/Weapon";

const DEFAULT_EXPORTED_NUMBER_PRECISION = 3;

const roundNumber = (
  num: number,
  precision: number = DEFAULT_EXPORTED_NUMBER_PRECISION
) => {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
};

interface RecordingInfo {
  name: string;
  scenarioId: string;
  scenarioName: string;
  startTime: number;
}

interface AircraftUpdate {
  id: string;
  name?: string;
  className?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  currentFuel?: number;
  maxFuel?: number;
  fuelRate?: number;
  range?: number;
  route?: number[][];
  weapons?: Weapon[];
  rtb?: boolean;
  targetId?: string;
}

interface AirbaseUpdate {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  aircraft?: Aircraft[];
}

interface ReferencePointUpdate {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

interface Change {
  currentTime: number;
  newAircraft?: Aircraft[];
  deletedAircraftIds?: string[];
  aircraftUpdates?: AircraftUpdate[];
  newAirbases?: Airbase[];
  deletedAirbaseIds?: string[];
  airbaseUpdates?: AirbaseUpdate[];
  newReferencePoints?: ReferencePoint[];
  deletedReferencePointIds?: string[];
  referencePointUpdates?: ReferencePointUpdate[];
}

class PlaybackRecorder {
  recordingInfo: RecordingInfo | null = null;
  recordedSteps: Change[] = [];
  previousStep: Scenario | null = null;

  reset() {
    this.recordingInfo = null;
    this.recordedSteps = [];
    this.previousStep = null;
  }

  startRecording(parameters: RecordingInfo, scenario: Scenario) {
    this.reset();
    this.recordingInfo = parameters;
    this.previousStep = scenario;
    this.recordInitialFrame(scenario);
  }

  recordInitialFrame(scenario: Scenario) {
    const change: Change = {
      currentTime: scenario.currentTime,
      newAircraft: scenario.aircraft,
      newAirbases: scenario.airbases,
      newReferencePoints: scenario.referencePoints,
    };
    this.recordedSteps.push(change);
  }

  getAircraftChanges(nextAircraft: Aircraft[]) {
    const previousAircraft = this.previousStep?.aircraft ?? [];
    const previousAircraftIds = previousAircraft.map((aircraft) => aircraft.id);
    const nextAircraftIds = nextAircraft.map((aircraft) => aircraft.id);
    // add new aircraft
    const newAircraft = nextAircraft.filter(
      (aircraft) => !previousAircraftIds.includes(aircraft.id)
    );
    // remove deleted aircraft
    const deletedAircraftIds =
      previousAircraft
        .filter((aircraft) => !nextAircraftIds.includes(aircraft.id))
        .map((aircraft) => aircraft.id) ?? [];
    // update other aircraft
    const updatedAircraft = nextAircraft.filter((aircraft) =>
      previousAircraftIds.includes(aircraft.id)
    );
    const aircraftUpdates: AircraftUpdate[] = [];
    updatedAircraft.forEach((currentAc) => {
      const previousAc = previousAircraft.find((ac) => ac.id === currentAc.id);
      if (!previousAc) {
        return;
      }
      const update: AircraftUpdate = {
        id: currentAc.id,
      };
      if (previousAc.name !== currentAc.name) update.name = currentAc.name;
      if (previousAc.className !== currentAc.className)
        update.className = currentAc.className;
      if (previousAc.latitude !== currentAc.latitude)
        update.latitude = roundNumber(currentAc.latitude);
      if (previousAc.longitude !== currentAc.longitude)
        update.longitude = roundNumber(currentAc.longitude);
      if (previousAc.altitude !== currentAc.altitude)
        update.altitude = roundNumber(currentAc.altitude);
      if (previousAc.heading !== currentAc.heading)
        update.heading = roundNumber(currentAc.heading);
      if (previousAc.speed !== currentAc.speed) update.speed = currentAc.speed;
      if (previousAc.currentFuel !== currentAc.currentFuel)
        update.currentFuel = roundNumber(currentAc.currentFuel);
      if (previousAc.maxFuel !== currentAc.maxFuel)
        update.maxFuel = roundNumber(currentAc.maxFuel);
      if (previousAc.fuelRate !== currentAc.fuelRate)
        update.fuelRate = roundNumber(currentAc.fuelRate);
      if (previousAc.range !== currentAc.range)
        update.range = roundNumber(currentAc.range);
      if (previousAc.route !== currentAc.route) {
        const route = currentAc.route.map((waypoint) => [
          roundNumber(waypoint[0]),
          roundNumber(waypoint[1]),
        ]);
        update.route = route;
      }
      if (previousAc.weapons !== currentAc.weapons)
        update.weapons = currentAc.weapons;
      if (previousAc.rtb !== currentAc.rtb) update.rtb = currentAc.rtb;
      if (previousAc.targetId !== currentAc.targetId)
        update.targetId = currentAc.targetId;
      if (Object.keys(update).length > 1) aircraftUpdates.push(update);
    });
    return {
      newAircraft,
      deletedAircraftIds,
      aircraftUpdates,
    };
  }

  getAirbaseChanges(nextAirbases: Airbase[]) {
    const previousAirbases = this.previousStep?.airbases ?? [];
    const previousAirbaseIds = previousAirbases.map((airbase) => airbase.id);
    const nextAirbaseIds = nextAirbases.map((airbase) => airbase.id);
    // add new airbases
    const newAirbases = nextAirbases.filter(
      (airbase) => !previousAirbaseIds.includes(airbase.id)
    );
    // remove deleted airbases
    const deletedAirbaseIds =
      previousAirbases
        .filter((airbase) => !nextAirbaseIds.includes(airbase.id))
        .map((ab) => ab.id) ?? [];
    // update other airbases
    const updatedAirbases = nextAirbases.filter((airbase) =>
      previousAirbaseIds.includes(airbase.id)
    );
    const airbaseUpdates: AirbaseUpdate[] = [];
    updatedAirbases.forEach((airbase) => {
      const previousAirbase = previousAirbases.find(
        (ab) => ab.id === airbase.id
      );
      if (!previousAirbase) {
        return;
      }
      const update: AirbaseUpdate = {
        id: airbase.id,
      };
      if (previousAirbase.name !== airbase.name) update.name = airbase.name;
      if (previousAirbase.latitude !== airbase.latitude)
        update.latitude = roundNumber(airbase.latitude);
      if (previousAirbase.longitude !== airbase.longitude)
        update.longitude = roundNumber(airbase.longitude);
      if (previousAirbase.altitude !== airbase.altitude)
        update.altitude = roundNumber(airbase.altitude);
      if (Object.keys(update).length > 1) airbaseUpdates.push(update);
    });
    return {
      newAirbases,
      deletedAirbaseIds,
      airbaseUpdates,
    };
  }

  getReferencePointChanges(nextReferencePoints: ReferencePoint[]) {
    const previousReferencePoints = this.previousStep?.referencePoints ?? [];
    const previousReferencePointIds = previousReferencePoints.map(
      (referencePoint) => referencePoint.id
    );
    const nextReferencePointIds = nextReferencePoints.map(
      (referencePoint) => referencePoint.id
    );
    // add new reference points
    const newReferencePoints = nextReferencePoints.filter(
      (referencePoint) => !previousReferencePointIds.includes(referencePoint.id)
    );
    // remove deleted reference points
    const deletedReferencePointIds =
      previousReferencePoints
        .filter(
          (referencePoint) => !nextReferencePointIds.includes(referencePoint.id)
        )
        .map((rp) => rp.id) ?? [];
    // update other reference points
    const updatedReferencePoints = nextReferencePoints.filter(
      (referencePoint) => previousReferencePointIds.includes(referencePoint.id)
    );
    const referencePointUpdates: ReferencePointUpdate[] = [];
    updatedReferencePoints.forEach((referencePoint) => {
      const previousReferencePoint = previousReferencePoints.find(
        (rp) => rp.id === referencePoint.id
      );
      if (!previousReferencePoint) {
        return;
      }
      const update: ReferencePointUpdate = {
        id: referencePoint.id,
      };
      if (previousReferencePoint.name !== referencePoint.name)
        update.name = referencePoint.name;
      if (previousReferencePoint.latitude !== referencePoint.latitude)
        update.latitude = roundNumber(referencePoint.latitude);
      if (previousReferencePoint.longitude !== referencePoint.longitude)
        update.longitude = roundNumber(referencePoint.longitude);
      if (previousReferencePoint.altitude !== referencePoint.altitude)
        update.altitude = roundNumber(referencePoint.altitude);
      if (Object.keys(update).length > 1) referencePointUpdates.push(update);
    });
    return {
      newReferencePoints,
      deletedReferencePointIds,
      referencePointUpdates,
    };
  }

  recordFrame(currentStep: Scenario) {
    if (!this.previousStep) {
      return;
    }
    const { newAircraft, deletedAircraftIds, aircraftUpdates } =
      this.getAircraftChanges(currentStep.aircraft);
    const { newAirbases, deletedAirbaseIds, airbaseUpdates } =
      this.getAirbaseChanges(currentStep.airbases);
    const {
      newReferencePoints,
      deletedReferencePointIds,
      referencePointUpdates,
    } = this.getReferencePointChanges(currentStep.referencePoints);
    const change: Change = {
      currentTime: currentStep.currentTime,
    };
    if (newAircraft.length > 0) change.newAircraft = newAircraft;
    if (deletedAircraftIds.length > 0)
      change.deletedAircraftIds = deletedAircraftIds;
    if (aircraftUpdates.length > 0) change.aircraftUpdates = aircraftUpdates;
    if (newAirbases.length > 0) change.newAirbases = newAirbases;
    if (deletedAirbaseIds.length > 0)
      change.deletedAirbaseIds = deletedAirbaseIds;
    if (airbaseUpdates.length > 0) change.airbaseUpdates = airbaseUpdates;
    if (newReferencePoints.length > 0)
      change.newReferencePoints = newReferencePoints;
    if (deletedReferencePointIds.length > 0)
      change.deletedReferencePointIds = deletedReferencePointIds;
    if (referencePointUpdates.length > 0)
      change.referencePointUpdates = referencePointUpdates;
    if (Object.keys(change).length > 1) this.recordedSteps.push(change);
    this.previousStep = currentStep;
  }

  exportRecording() {
    if (!this.recordingInfo) {
      return;
    }
    const recording = {
      info: this.recordingInfo,
      steps: this.recordedSteps,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(recording));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `${this.recordingInfo.name}.json`
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // output JSONL file instead of JSON which might facilitate streaming
    // const jsonlDataStr = this.recordedSteps.map((step) => {
    //   return JSON.stringify(step);
    // });
    // const jsonlData = jsonlDataStr.join("\n");
    // const jsonlDataStrUrl =
    //   "data:text/json;charset=utf-8," + encodeURIComponent(jsonlData);
    // const downloadJsonlAnchorNode = document.createElement("a");
    // downloadJsonlAnchorNode.setAttribute("href", jsonlDataStrUrl);
    // downloadJsonlAnchorNode.setAttribute(
    //   "download",
    //   `${this.recordingInfo.name}.jsonl`
    // );
    // document.body.appendChild(downloadJsonlAnchorNode); // required for firefox
    // downloadJsonlAnchorNode.click();
    // downloadJsonlAnchorNode.remove();
  }
}

export default PlaybackRecorder;
