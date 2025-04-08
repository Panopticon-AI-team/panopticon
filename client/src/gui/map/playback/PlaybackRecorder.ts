import Scenario from "@/game/Scenario";

const FILE_SIZE_LIMIT_MB = 10;
const CHARACTER_LIMIT = FILE_SIZE_LIMIT_MB * 1024 * 1024;
const RECORDING_INTERVAL_SECONDS = 10;

class PlaybackRecorder {
  scenarioName: string = "New Scenario";
  currentScenarioTime: number = 0;
  recording: string = "";
  currentRecordingFilePart: number = 0;
  recordEverySeconds: number = RECORDING_INTERVAL_SECONDS;

  constructor(recordEverySeconds: number) {
    this.recordEverySeconds = recordEverySeconds || RECORDING_INTERVAL_SECONDS;
  }

  setRecordingInterval(recordEverySeconds: number) {
    this.recordEverySeconds = recordEverySeconds;
  }

  shouldRecord(currentScenarioTime: number) {
    if (
      currentScenarioTime - this.currentScenarioTime >=
      this.recordEverySeconds
    ) {
      this.currentScenarioTime = currentScenarioTime;
      return true;
    }
    return false;
  }

  reset() {
    this.scenarioName = "New Scenario";
    this.recording = "";
    this.currentRecordingFilePart = 0;
    this.currentScenarioTime = 0;
  }

  startRecording(scenario: Scenario) {
    this.reset();
    this.scenarioName = scenario.name;
    this.currentScenarioTime = scenario.currentTime;
  }

  recordStep(currentStep: string) {
    this.recording += currentStep + "\n";
    if (this.recording.length > CHARACTER_LIMIT) {
      this.exportRecording(this.currentRecordingFilePart);
      this.currentRecordingFilePart++;
      this.recording = "";
    }
  }

  exportRecording(currentRecordingFilePart: number | null = null) {
    if (this.recording.length === 0) {
      return;
    }
    const jsonlDataStrUrl =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(this.recording.slice(0, -1));
    const downloadJsonlAnchorNode = document.createElement("a");
    downloadJsonlAnchorNode.setAttribute("href", jsonlDataStrUrl);
    let recordingFilePartSuffix = "";
    if (currentRecordingFilePart !== null) {
      recordingFilePartSuffix = " Part " + currentRecordingFilePart.toString();
    } else if (
      this.currentRecordingFilePart > 0 &&
      currentRecordingFilePart === null
    ) {
      recordingFilePartSuffix =
        " Part " + this.currentRecordingFilePart.toString();
    }
    downloadJsonlAnchorNode.setAttribute(
      "download",
      `${this.scenarioName} Recording${recordingFilePartSuffix}.jsonl`
    );
    document.body.appendChild(downloadJsonlAnchorNode); // required for firefox
    downloadJsonlAnchorNode.click();
    downloadJsonlAnchorNode.remove();
  }
}

export default PlaybackRecorder;
