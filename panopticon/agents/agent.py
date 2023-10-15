"""
This is the agent, and it is being used. right now the action is just hardcoded for testing
"""
from environments.panopticon_env.actionhandler import Action


class PanopticonAgent:
    def __init__(self, env):
        self.env = env

    def choose_action(self, s):
        time = s.time
        if time == 0:
            # take an arbitrary action to test
            action = Action("JBER", "launch", "JBER1", "moveto", "CN")
            action1 = Action("JBER", "idle", "JBER1", "moveto", "CN")

        actions = (action, action1)
        return actions

    def learn(self, s, a, reward, s_prime):
        self.qtable.update(s, a, reward, s_prime, self.alpha, self.gamma)
