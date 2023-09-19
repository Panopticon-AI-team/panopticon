""" 
lists all the classes and stuff. this is an important file
"""
import json
import math
import copy
from actionhandler import ActionHandler
from statesummarizer import StateSummarizer
import tkinter as tk
from canvas import Canvas


class Munition:
    def __init__(self, unit, munition_json):
        self.unit = unit  # where it belongs
        self.munition_id = munition_json["munition_id"]
        self.munition_loc_x = unit.unit_loc_x
        self.munition_loc_y = unit.unit_loc_y
        self.pk = munition_json["pk"]
        self.range = munition_json["range"]
        self.speed = munition_json["speed"]
        self.action = "idle"

    def get_loc(self):
        return self.munition_loc_x, self.munition_loc_y


class Unit:
    def __init__(self, base, unit_json):
        self.base = base  # where it belongs
        self.unit_loc_x = base.base_loc_x
        self.unit_loc_y = base.base_loc_y
        self.unit_id = unit_json["unit_id"]
        self.speed = unit_json["unit_speed"]
        self.range = unit_json["unit_range"]
        self.munitions_ls = []
        self.target = None
        self.state = None

        munitions_json_ls = unit_json["munitions"]
        for munition_json in munitions_json_ls:
            munition = Munition(self, munition_json)
            self.munitions_ls.append(munition)

    def get_munitions(self):
        return self.munitions_ls

    def get_loc(self):
        return self.unit_loc_x, self.unit_loc_y


class Base:
    def __init__(self, base_json):
        self.base_name = base_json["base_name"]
        self.base_health = base_json["health"]
        self.base_loc_x = base_json["base_loc_x"]
        self.base_loc_y = base_json["base_loc_y"]
        self.base_action_state = base_json["base_action_state"]
        self.units_ls = []

        units_json_ls = base_json["units"]
        for unit_json in units_json_ls:
            unit = Unit(self, unit_json)
            self.units_ls.append(unit)

    def get_units(self):
        return self.units_ls

    def get_loc(self):
        return self.base_loc_x, self.base_loc_y

    def get_base_name(self):
        return self.base_name


class GameState:
    def __init__(self, config):
        # construct the bases
        bases_json_ls = config["bases"]
        self.bases_ls = []
        self.units_ls = []
        self.munitions_ls = []

        # initialize everything by base, and then

        # these each "unroll" the base into the lists
        for base_json in bases_json_ls:
            base = Base(base_json)
            self.bases_ls.append(base)

        for base in self.bases_ls:
            units_ls = base.get_units()
            for unit in units_ls:
                self.units_ls.append(unit)

        for unit in self.units_ls:
            munitions_ls = unit.get_munitions()
            for munition in munitions_ls:
                self.munitions_ls.append(munition)

    def get_bases(self):
        return self.bases_ls

    def get_units(self):
        return self.units_ls

    def get_munitions(self):
        return self.munitions_ls


class Environment:
    def __init__(self, config_path):
        try:
            with open(config_path, "r") as file:
                config = json.load(file)
        except FileNotFoundError:
            print("Error: The config.json file was not found.")
        except json.JSONDecodeError:
            print("Error: The config file is not in proper JSON format.")

        self.game_state = GameState(config)
        ssumarizer = StateSummarizer(copy.deepcopy(self.game_state))
        ssumarizer.print_unit_coordinates()
        self.time = 0
        print("hi")

    def reset(self):
        pass
        # return initial_state

    def step(self, actions):
        # action pre-processing steps
        action, action1 = actions

        print("taking actions")
        ssumarizer = StateSummarizer(self.game_state)

        ahandler = ActionHandler(self.game_state)

        ssumarizer.print_unit_coordinates()
        ahandler.apply_action(action)
        ssumarizer.print_unit_coordinates()
        ahandler.apply_action(copy.deepcopy(action1))
        ssumarizer.print_unit_coordinates()
        ahandler.apply_action(copy.deepcopy(action1))
        ssumarizer.print_unit_coordinates()
        print("action handled...?")

        self.time = self.time + 1

        # so we go into the actions and make them happen. For example,

        """"""
        pass
        # new_state, rewards = process_actions(actions)
        # return new_state, rewards
