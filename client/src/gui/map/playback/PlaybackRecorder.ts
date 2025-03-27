import Scenario from "@/game/Scenario";
import Airbase from "@/game/units/Airbase";
import Aircraft from "@/game/units/Aircraft";
import Facility from "@/game/units/Facility";
import ReferencePoint from "@/game/units/ReferencePoint";
import Ship from "@/game/units/Ship";
import Weapon from "@/game/units/Weapon";

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
        update.latitude = currentAc.latitude;
      if (previousAc.longitude !== currentAc.longitude)
        update.longitude = currentAc.longitude;
      if (previousAc.altitude !== currentAc.altitude)
        update.altitude = currentAc.altitude;
      if (previousAc.heading !== currentAc.heading)
        update.heading = currentAc.heading;
      if (previousAc.speed !== currentAc.speed) update.speed = currentAc.speed;
      if (previousAc.currentFuel !== currentAc.currentFuel)
        update.currentFuel = currentAc.currentFuel;
      if (previousAc.maxFuel !== currentAc.maxFuel)
        update.maxFuel = currentAc.maxFuel;
      if (previousAc.fuelRate !== currentAc.fuelRate)
        update.fuelRate = currentAc.fuelRate;
      if (previousAc.range !== currentAc.range) update.range = currentAc.range;
      if (previousAc.route !== currentAc.route) update.route = currentAc.route;
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
        update.latitude = referencePoint.latitude;
      if (previousReferencePoint.longitude !== referencePoint.longitude)
        update.longitude = referencePoint.longitude;
      if (previousReferencePoint.altitude !== referencePoint.altitude)
        update.altitude = referencePoint.altitude;
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
