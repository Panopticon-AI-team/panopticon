import os
import gymnasium
import numpy as np
import blade
from blade.Game import Game
from blade.Scenario import Scenario
from stable_baselines3 import PPO
from gymnasium.spaces import Box

demo_folder = "./gym/scripts/stable_baselines"

game = Game(current_scenario=Scenario())
with open(f"{demo_folder}/scen.json", "r") as scenario_file:
    game.load_scenario(scenario_file.read())

observation_space = Box(low=np.array([-90.0, -180.0]), high=np.array([90.0, 180.0]), dtype=np.float32)
action_space = Box(low=np.array([-90.0, -180.0]), high=np.array([90.0, 180.0]), dtype=np.float32)

def action_transform_fnc(observation: Scenario, action: np.ndarray):
    latitude = action[0]
    longitude = action[1]
    aircraft_id = observation.aircraft[0].id
    action = f"move_aircraft('{aircraft_id}', {latitude}, {longitude})"
    return action

def observation_filter_fnc(observation: Scenario):
    aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
    if aircraft == None:
        return np.array([0, 0])
    return np.array([aircraft.latitude, aircraft.longitude])

def reward_filter_fnc(observation: Scenario):
    aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
    goal_latitude = 4.5
    goal_longitude = 5.5    
    if aircraft == None:
        distance = 0
    else:
        distance = np.sqrt((goal_latitude - aircraft.latitude)**2 + (goal_longitude - aircraft.longitude)**2)
    reward = -distance
    return reward

def termination_filter_fnc(observation: Scenario):
    aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
    goal_latitude = 4.5
    goal_longitude = 5.5
    if aircraft == None:
        distance = 0
    else:
        distance = np.sqrt((goal_latitude - aircraft.latitude)**2 + (goal_longitude - aircraft.longitude)**2)
    terminated = distance < 0.1
    return terminated

env = gymnasium.make("blade/BLADE-v0", game=game,
    observation_space=observation_space,
    action_space=action_space,
    action_transform_fnc=action_transform_fnc,
    observation_filter_fnc=observation_filter_fnc,
    reward_filter_fnc=reward_filter_fnc,
    termination_filter_fnc=termination_filter_fnc)

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
