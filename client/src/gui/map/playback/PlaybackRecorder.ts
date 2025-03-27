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
  name: string;
  className: string;
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
  currentFuel: number;
  maxFuel: number;
  fuelRate: number; // lbs/hr
  range: number;
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
    const {
      newReferencePoints,
      deletedReferencePointIds,
      referencePointUpdates,
    } = this.getReferencePointChanges(currentStep.referencePoints);
    const change: Change = {
      currentTime: currentStep.currentTime,
    };
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
  }
}

export default PlaybackRecorder;
