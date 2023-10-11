"""
This is the main game file
"""

from panopticon.agents.agent import PanopticonAgent
from panopticon.environments.panopticon_env.environment import Environment
from panopticon.environments.panopticon_env.canvas import Canvas
import tkinter as tk
import json


class Game:
    def __init__(self, config_path):
        self.env = Environment(config_path)
        self.agent1 = PanopticonAgent(self.env)

        self.root = tk.Tk()
        app = Canvas(self.root, "./panopticon/environments/resources/world-map.gif")

        self.root.mainloop()
        # self.agent2 = Agent(....)

    def play_round(self):
        done = False
        while not done:
            a1 = self.agent1.choose_action(self.env)

            s_prime, rewards = self.env.step(a1)

            self.agent1.learn(s, a1, rewards[0], s_prime)
            # self.agent2.learn(s, a2, rewards[1], s_prime)

            s = s_prime

    def train(self, num_rounds):
        for _ in range(num_rounds):
            self.play_round()


def main():
    # Initialize game
    config_path = "./panopticon/config.json"
    game = Game(config_path)

    # Train for a specified number of rounds
    num_training_rounds = 1000
    game.train(num_training_rounds)

    # Optionally, you can add evaluation or testing code after training
    # to see how well the agents have learned to compete against each other.

    # For now, let's print out a portion of Player 1's Q-table to see its learned values
    print("Player 1's Q-Table after training:")
    # print_subset_of_qtable(game.player1.qtable.table)


if __name__ == "__main__":
    main()
