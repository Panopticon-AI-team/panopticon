import json
import gymnasium as gym
from gymnasium.spaces import Text

from blade.Game import Game
from blade.Scenario import Scenario
from blade.utils.constants import BLADE_ENV_OBSERVATION_SPACE_MAX_CHARACTERS, BLADE_ENV_ACTION_SPACE_MAX_CHARACTERS


class BLADE(gym.Env):

    def __init__(self, render_mode=None, game:Game=None, observation_space=None, action_space=None, action_transform_fnc=None, observation_filter_fnc=None, reward_filter_fnc=None, termination_filter_fnc=None):
        if observation_space is None:
            self.observation_space = Text(max_length=BLADE_ENV_OBSERVATION_SPACE_MAX_CHARACTERS)
        else:
            self.observation_space = observation_space
        if action_space is None:
            self.action_space = Text(max_length=BLADE_ENV_ACTION_SPACE_MAX_CHARACTERS)
        else:
            self.action_space = action_space
        self.action_transform_fnc = action_transform_fnc
        self.observation_filter_fnc = observation_filter_fnc
        self.reward_filter_fnc = reward_filter_fnc
        self.termination_filter_fnc = termination_filter_fnc
        self.render_mode = render_mode
        self.game = game

    def _get_obs(self):
        obs = self.game._get_observation()
        if self.observation_filter_fnc is not None:
            obs = self.observation_filter_fnc(obs)
        return obs

    def _get_info(self):
        return self.game._get_info()

    def reset(self, seed=None, options=None):
        self.game.reset()
        observation = self._get_obs()
        info = self._get_info()
        return observation, info

    def step(self, action):
        if self.action_transform_fnc is not None:
            action = self.action_transform_fnc(self.game.current_scenario, action)
        observation, reward, terminated, truncated, info = self.game.step(action = action)
        if self.reward_filter_fnc is not None:
            reward = self.reward_filter_fnc(observation)
        if self.termination_filter_fnc is not None:
            terminated = self.termination_filter_fnc(observation)
        if self.observation_filter_fnc is not None:
            observation = self.observation_filter_fnc(observation)
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
