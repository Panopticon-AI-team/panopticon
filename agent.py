"""
This is the agent, and it is being used. right now the action is just hardcoded for testing
"""


class Agent:
    def __init__(self, env):
        self.env = env

    def choose_action(self, s):
        game = s.game_state
        time = game.time
        if time == 0:
            # take an arbitrary action to test
            action = Action("JBER", "launch", "JBER1", "MoveTo", "CN")

        return action

    def learn(self, s, a, reward, s_prime):
        self.qtable.update(s, a, reward, s_prime, self.alpha, self.gamma)


class Action:
    def __init__(self, base_chosen, base_action, unit_chosen, unit_action, unit_target):
        self.base_chosen = base_chosen
        self.base_action = base_action
        self.unit_chosen = unit_chosen
        self.unit_action = unit_action  # what the unit chosen will do
        self.unit_target = unit_target  # the object of the unit's action
