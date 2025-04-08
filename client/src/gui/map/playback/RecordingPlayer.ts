class RecordingPlayer {
  recording: string[] = [];
  currentStep: number = 0;

  loadRecording(recording: string) {
    this.recording = recording.split("\n");
    this.currentStep = 0;
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
}

export default RecordingPlayer;
