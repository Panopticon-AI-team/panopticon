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

interface Step {
  currentTime: number;
  aircraft?: Aircraft[];
  ships?: Ship[];
  facilities?: Facility[];
  airbases?: Airbase[];
  weapons?: Weapon[];
  referencePoints?: ReferencePoint[];
}

class PlaybackRecorder {
  recordingInfo: RecordingInfo | null = null;
  recordedSteps: Step[] = [];

  constructor() {
    this.recordingInfo = null;
    this.recordedSteps = [];
  }

  reset() {
    this.recordingInfo = null;
    this.recordedSteps = [];
  }

  startRecording(parameters: RecordingInfo) {
    this.reset();
    this.recordingInfo = parameters;
  }

  recordFrame(scenario: Scenario) {
    const step: Step = {
      currentTime: scenario.currentTime,
      aircraft: scenario.aircraft,
      ships: scenario.ships,
      facilities: scenario.facilities,
      airbases: scenario.airbases,
      weapons: scenario.weapons,
      referencePoints: scenario.referencePoints,
    };
    this.recordedSteps.push(step);
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
