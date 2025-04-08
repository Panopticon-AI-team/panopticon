from blade.Scenario import Scenario
from typing import Optional

FILE_SIZE_LIMIT_MB = 10
CHARACTER_LIMIT = FILE_SIZE_LIMIT_MB * 1024 * 1024
RECORDING_INTERVAL_SECONDS = 10


class PlaybackRecorder:

    def __init__(
        self,
        record_every_seconds: Optional[int] = None,
        recording_export_path: Optional[str] = ".",
    ) -> None:
        self.scenario_name: str = "New Scenario"
        self.current_scenario_time: int = 0
        self.recording: str = ""
        self.current_recording_file_part: int = 0
        self.record_every_seconds: int = (
            record_every_seconds if record_every_seconds else RECORDING_INTERVAL_SECONDS
        )
        self.recording_export_path: str = recording_export_path

    def should_record(self, current_scenario_time: int) -> bool:
        if (
            current_scenario_time - self.current_scenario_time
            >= self.record_every_seconds
        ):
            self.current_scenario_time = current_scenario_time
            return True
        return False

    def reset(self):
        self.scenario_name = "New Scenario"
        self.recording = ""
        self.current_recording_file_part = 0
        self.current_scenario_time = 0

    def start_recording(self, scenario: Scenario):
        self.reset()
        self.scenario_name = scenario.name
        self.current_scenario_time = scenario.current_time

    def record_step(self, current_step: str):
        self.recording += current_step + "\n"
        if len(self.recording) > CHARACTER_LIMIT:
            self.export_recording(self.current_recording_file_part)
            self.current_recording_file_part += 1
            self.recording = ""

    def export_recording(self, current_recording_file_part: Optional[int] = None):
        if not self.recording:
            return

        suffix = ""
        if current_recording_file_part is not None:
            suffix = f" Part {current_recording_file_part}"
        elif self.current_recording_file_part > 0:
            suffix = f" Part {self.current_recording_file_part}"

        filename = (
            f"{self.recording_export_path}/{self.scenario_name} Recording{suffix}.jsonl"
        )

        with open(filename, "w", encoding="utf-8") as file:
            file.write(self.recording.rstrip("\n"))

        print(f"Recording exported to '{filename}'")

    """     
    import gzip
    import json

    def export_recording(self) -> None:
        if not self.recording_info:
            print("No active recording to export.")
            return
        recording = {
            "info": self.recording_info,
            "steps": self.recorded_steps,
        }
        
        for steps in recording["steps"]:
            if type(steps) is not dict:
                print(steps)
        filename = f"{self.recording_info['name']}.json.gz"
        with gzip.open(filename, "wt", encoding="utf-8") as f:
            json.dump(recording, f, cls=ReducedScenarioEncoder, indent=2)
        print(f"Recording exported to {filename}") 
    """
