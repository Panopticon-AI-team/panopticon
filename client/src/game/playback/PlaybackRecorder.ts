import Scenario from "@/game/Scenario";
import { RECORDING_INTERVALS_SECONDS } from "@/utils/constants";
import { unixToLocalTime } from "@/utils/dateTimeFunctions";

const FILE_SIZE_LIMIT_MB = 10;
const CHARACTER_LIMIT = FILE_SIZE_LIMIT_MB * 1024 * 1024;
const RECORDING_INTERVAL_SECONDS = 10;

class PlaybackRecorder {
  scenarioName: string = "New Scenario";
  currentScenarioTime: number = 0;
  recording: string = "";
  recordingStartTime: number = 0;
  recordEverySeconds: number = RECORDING_INTERVAL_SECONDS;

  constructor(recordEverySeconds: number) {
    this.recordEverySeconds = recordEverySeconds || RECORDING_INTERVAL_SECONDS;
  }

  switchRecordingInterval() {
    for (let i = 0; i < RECORDING_INTERVALS_SECONDS.length; i++) {
      if (this.recordEverySeconds === RECORDING_INTERVALS_SECONDS[i]) {
        this.recordEverySeconds =
          RECORDING_INTERVALS_SECONDS[
            (i + 1) % RECORDING_INTERVALS_SECONDS.length
          ];
        break;
      }
    }
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
    this.currentScenarioTime = 0;
    this.recordingStartTime = 0;
  }

  startRecording(scenario: Scenario) {
    this.reset();
    this.scenarioName = scenario.name;
    this.currentScenarioTime = scenario.currentTime;
    this.recordingStartTime = scenario.currentTime;
  }

  recordStep(currentStep: string, currentScenarioTime: number) {
    this.recording += currentStep + "\n";
    if (this.recording.length > CHARACTER_LIMIT) {
      this.exportRecording(currentScenarioTime, this.recordingStartTime);
      this.recordingStartTime = currentScenarioTime;
      this.recording = "";
    }
  }

  exportRecording(
    recordingEndTimeUnix: number,
    recordingStartTimeUnix: number = this.recordingStartTime
  ) {
    if (this.recording.length === 0) {
      return;
    }
    const jsonlDataStrUrl =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(this.recording.slice(0, -1));
    const downloadJsonlAnchorNode = document.createElement("a");
    downloadJsonlAnchorNode.setAttribute("href", jsonlDataStrUrl);
    const formattedRecordingStartTime = unixToLocalTime(
      recordingStartTimeUnix
    ).replace(/:/g, "");
    const formattedRecordingEndTime = unixToLocalTime(
      recordingEndTimeUnix
    ).replace(/:/g, "");
    const recordingFileTimespanSuffix = `${formattedRecordingStartTime} - ${formattedRecordingEndTime}`;
    downloadJsonlAnchorNode.setAttribute(
      "download",
      `${this.scenarioName} Recording ${recordingFileTimespanSuffix}.jsonl`
    );
    document.body.appendChild(downloadJsonlAnchorNode); // required for firefox
    downloadJsonlAnchorNode.click();
    downloadJsonlAnchorNode.remove();
  }
}

export default PlaybackRecorder;
