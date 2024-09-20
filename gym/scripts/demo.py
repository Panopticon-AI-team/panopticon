import json
import gymnasium
import blade
from blade.Game import Game
from blade.Scenario import Scenario

game = Game(current_scenario = Scenario())
with open("./gym/blade/scenarios/default_scenario.json", "r") as scenario_file:
    game.load_scenario(scenario_file.read())

env = gymnasium.make('blade/BLADE-v0', game = game)

observation, info = env.reset()
env.pretty_print(observation)

for _ in range(100):
    observation, reward, terminated, truncated, info = env.step(action=0)
    env.pretty_print(observation)

with open(f'{game.current_scenario.name}_end_state.json', 'w') as scenario_file:
    json.dump(env.export_scenario(), scenario_file)