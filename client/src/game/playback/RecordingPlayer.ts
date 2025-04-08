import { unixToLocalTime } from "@/utils/dateTimeFunctions";

class RecordingPlayer {
  recording: string[] = [];
  recordingScenarioTimes: string[] = [];
  currentStep: number = 0;
  playing: boolean = false;

  hasRecording() {
    return this.recording.length > 0;
  }

  validateRecordingStep(recordingStep: string) {
    try {
      const step = JSON.parse(recordingStep);
      if (!step.currentScenario) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  loadRecording(recording: string) {
    const recordingInput = recording.split("\n");
    if (recordingInput.length === 0) return false;
    const validatedRecording = recordingInput.filter((step) => {
      return this.validateRecordingStep(step);
    });
    if (validatedRecording.length === 0) return false;
    this.recording = validatedRecording;
    this.currentStep = 0;
    this.playing = false;
    this.recordingScenarioTimes = this.recording.map((step) => {
      const stepData = JSON.parse(step);
      if (stepData.currentScenario?.currentTime)
        return unixToLocalTime(parseInt(stepData.currentScenario.currentTime));
      return unixToLocalTime(0);
    });
    return true;
  }

  setCurrentStepIndex(index: number) {
    if (index < 0) {
      this.currentStep = 0;
    } else if (index >= this.recording.length) {
      this.currentStep = this.recording.length - 1;
    } else {
      this.currentStep = index;
    }
  }

  getCurrentStepIndex() {
    return this.currentStep;
  }

  getStartStepIndex() {
    return 0;
  }

  getEndStepIndex() {
    return this.recording.length - 1;
  }

  getStepScenarioTime(step: number) {
    if (step < 0) {
      return this.recordingScenarioTimes[0];
    } else if (step >= this.recordingScenarioTimes.length) {
      return this.recordingScenarioTimes[
        this.recordingScenarioTimes.length - 1
      ];
    }
    return this.recordingScenarioTimes[step];
  }

  getCurrentStep() {
    return this.recording[this.currentStep];
  }

  nextStep() {
    if (this.currentStep < this.recording.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  reset() {
    this.currentStep = 0;
  }

  isAtEnd() {
    return this.currentStep >= this.recording.length - 1;
  }

  isAtStart() {
    return this.currentStep <= 0;
  }

  isAtStep(step: number) {
    return this.currentStep === step;
  }

  isPaused() {
    return !this.playing;
  }
}

export default RecordingPlayer;
