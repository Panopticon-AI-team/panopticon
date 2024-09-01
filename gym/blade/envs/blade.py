import gymnasium as gym
from gymnasium import spaces

from blade.Game import Game


class BLADE(gym.Env):

    def __init__(self, render_mode=None, game=Game):
        self.observation_space = spaces.Box(low=-1, high=1, shape=(3,))
        self.action_space = spaces.Discrete(2)
        self.render_mode = render_mode
        self.game = game

    def _get_obs(self):
        return self.game._get_observation()

    def _get_info(self):
        return self.game._get_info()

    def reset(self):
        self.game.reset()

        observation = self._get_obs()
        info = self._get_info()

        return observation, info

    def step(self, action):
        observation, reward, terminated, truncated, info = self.game.step()

        return observation, reward, terminated, truncated, info
