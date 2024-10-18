import json
import gymnasium as gym
from gymnasium.spaces import Text

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
