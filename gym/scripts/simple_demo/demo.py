import gymnasium
import blade
from blade.Game import Game
from blade.Scenario import Scenario

demo_folder = "./gym/scripts/simple_demo"

game = Game(current_scenario=Scenario())
with open(f"{demo_folder}/simple_scenario.json", "r") as scenario_file:
    game.load_scenario(scenario_file.read())

env = gymnasium.make("blade/BLADE-v0", game=game)

observation, info = env.reset()
env.unwrapped.pretty_print(observation)

sample_launch_aircraft_action = "launch_aircraft_from_airbase('05dbcb4c-dcf8-4125-ba2e-3a6fce8b33a3')" # launch an aircraft from the BLUE airbase

for step in range(100):
    action = sample_launch_aircraft_action if step == 0 else ""
    observation, reward, terminated, truncated, info = env.step(action = action)
    env.unwrapped.pretty_print(observation)

env.unwrapped.export_scenario(f"{demo_folder}/simple_scenario_end_state.json")
