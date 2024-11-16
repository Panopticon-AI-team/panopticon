import json
import gymnasium as gym
import numpy as np
from gymnasium.spaces import Text, Box

from blade.Game import Game
from blade.Scenario import Scenario
from blade.utils.constants import BLADE_ENV_OBSERVATION_SPACE_MAX_CHARACTERS, BLADE_ENV_ACTION_SPACE_MAX_CHARACTERS


class BLADE(gym.Env):

    def __init__(self, render_mode=None, game:Game=None):
        self.observation_space = Text(max_length=BLADE_ENV_OBSERVATION_SPACE_MAX_CHARACTERS)
        self.action_space = Text(max_length=BLADE_ENV_ACTION_SPACE_MAX_CHARACTERS)
        self.render_mode = render_mode
        self.game = game

    def _get_obs(self):
        return self.game._get_observation()

    def _get_info(self):
        return self.game._get_info()

    def reset(self, seed=None, options=None):
        self.game.reset()
        observation = self._get_obs()
        info = self._get_info()
        return observation, info

    def step(self, action):
        observation, reward, terminated, truncated, info = self.game.step(action = action)
        return observation, reward, terminated, truncated, info
    
    def export_scenario(self, file_path:str = None):
        if file_path == None:
            file_path = f'{self.game.current_scenario.name}_end_state.json'
        with open(file_path, 'w') as scenario_file:
            json.dump(self.game.export_scenario(), scenario_file)
    
    def pretty_print(self, observation: Scenario = None):
        if (observation == None):
            observation = self._get_obs()
        print("Current Time: " + str(observation.current_time))

class SIMPLE_BLADE(gym.Env):

    def __init__(self, render_mode=None, game:Game=None):
        self.observation_space = Box(low=np.array([-90.0, -180.0]), high=np.array([90.0, 180.0]), dtype=np.float32)
        self.action_space = Box(low=np.array([-90.0, -180.0]), high=np.array([90.0, 180.0]), dtype=np.float32)
        self.render_mode = render_mode
        self.game = game

    def _get_obs(self):
        # this environment will only work with a custom scenario with only one aircraft
        observation = self.game._get_observation()
        aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
        if aircraft == None:
            return np.array([0, 0])
        return np.array([aircraft.latitude, aircraft.longitude])

    def _get_info(self):
        return self.game._get_info()

    def reset(self, seed=None, options=None):
        self.game.reset()
        observation = self._get_obs()
        info = self._get_info()
        return observation, info

    def step(self, action):
        # this environment will only work with a custom scenario with only one aircraft
        latitude = action[0]
        longitude = action[1]
        aircraft_id = self.game.current_scenario.aircraft[0].id
        action = f"move_aircraft('{aircraft_id}', {latitude}, {longitude})"
        observation, reward, terminated, truncated, info = self.game.step(action = action)
        aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
        goal_latitude = 4.5
        goal_longitude = 5.5
        if aircraft == None:
            distance = 0
        else:
            distance = np.sqrt((goal_latitude - aircraft.latitude)**2 + (goal_longitude - aircraft.longitude)**2)
        terminated = distance < 0.01
        reward = -distance
        observation = self._get_obs()
        return observation, reward, terminated, truncated, info
    
    def export_scenario(self, file_path:str = None):
        if file_path == None:
            file_path = f'{self.game.current_scenario.name}_end_state.json'
        with open(file_path, 'w') as scenario_file:
            json.dump(self.game.export_scenario(), scenario_file)
    
    def pretty_print(self, observation: Scenario = None):
        if (observation == None):
            observation = self._get_obs()
        print("Current Time: " + str(observation.current_time))
