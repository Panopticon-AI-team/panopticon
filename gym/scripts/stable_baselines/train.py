import os
import gymnasium
import blade
from blade.Game import Game
from blade.Scenario import Scenario
from stable_baselines3 import PPO

demo_folder = "./gym/scripts/stable_baselines"

game = Game(current_scenario=Scenario())
with open(f"{demo_folder}/scen.json", "r") as scenario_file:
    game.load_scenario(scenario_file.read())

env = gymnasium.make("blade/SIMPLE-BLADE-v0", game=game)

model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=35_000 * 10)

observation, info = env.reset()

for filename in os.listdir(demo_folder):
    if filename.endswith(".json") and "scen_t" in filename:
        os.remove(f"{demo_folder}/{filename}")

vec_env = model.get_env()
obs = vec_env.reset()

steps = 35000
for step in range(steps):
    action, _states = model.predict(obs, deterministic=True)
    obs, reward, done, info = vec_env.step(action)
    if step == 10000:
        env.unwrapped.export_scenario(f"{demo_folder}/scen_t{step}.json")
    elif step == 20000:
        env.unwrapped.export_scenario(f"{demo_folder}/scen_t{step}.json")
    elif step == 30000:
        env.unwrapped.export_scenario(f"{demo_folder}/scen_t{step}.json")

env.unwrapped.export_scenario(f"{demo_folder}/scen_t{steps}.json") # target location is (4.5, 5.5)
