from typing import Optional
from blade.Scenario import Scenario
from blade.utils.utils import unix_to_local_time

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
        self.recording_start_time: int = 0
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
        self.current_scenario_time = 0
        self.recording_start_time = 0

    def start_recording(self, scenario: Scenario):
        self.reset()
        self.scenario_name = scenario.name
        self.current_scenario_time = scenario.current_time
        self.recording_start_time = scenario.current_time

    def record_step(self, current_step: str, current_scenario_time: int):
        self.recording += current_step + "\n"
        if len(self.recording) > CHARACTER_LIMIT:
            self.export_recording(current_scenario_time, self.recording_start_time)
            self.recording_start_time = current_scenario_time
            self.recording = ""

    def export_recording(
        self,
        recording_end_time_unix: int,
        recording_start_time_unix: Optional[int] = None,
    ):
        if not self.recording:
            return

        if recording_start_time_unix is None:
            recording_start_time_unix = self.recording_start_time

        formatted_recording_start_time = unix_to_local_time(
            recording_start_time_unix, separator=""
        )
        formatted_recording_end_time = unix_to_local_time(
            recording_end_time_unix, separator=""
        )
        suffix = f"{formatted_recording_start_time} - {formatted_recording_end_time}"

        filename = f"{self.recording_export_path}/{self.scenario_name} Recording {suffix}.jsonl"

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
