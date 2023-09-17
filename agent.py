"""
This is the agent, and it is being used. right now the action is just hardcoded for testing
"""


class Agent:
    def __init__(self, env):
        self.env = env

    def choose_action(self, s):
        time = s.time
        if time == 0:
            # take an arbitrary action to test
            action = Action("JBER", "launch", "JBER1", "moveTo", "CN")
            action1 = Action("JBER", "idle", "JBER1", "moveTo", "CN")

        actions = (action, action1)
        return actions

    def learn(self, s, a, reward, s_prime):
        self.qtable.update(s, a, reward, s_prime, self.alpha, self.gamma)


# basically like a struct for actions
class Action:
    def __init__(self, base_chosen, base_action, unit_chosen, unit_action, unit_target):
        self.base_chosen = base_chosen
        self.base_action = base_action
        self.unit_chosen = unit_chosen
        self.unit_action = unit_action  # what the unit chosen will do
        self.unit_target = unit_target  # the object of the unit's action

    def __str__(self):
        str = (
            f"Base Chosen: {self.base_chosen}\n"
            f"Base Action: {self.base_action}\n"
            f"Unit Chosen: {self.unit_chosen}\n"
            f"Unit Action: {self.unit_action}\n"
            f"Unit Target: {self.unit_target}"
        )
        return str
