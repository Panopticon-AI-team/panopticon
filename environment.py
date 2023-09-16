""" 
lists all the classes and stuff. this is an important file
"""
import json


class Munition:
    def __init__(self, unit, munition_json):
        self.unit = unit  # where it belongs
        self.munition_id = munition_json["munition_id"]
        self.pk = munition_json["pk"]
        self.range = munition_json["range"]
        self.speed = munition_json["speed"]
        self.action = "idle"


class Unit:
    def __init__(self, base, unit_json):
        self.base = base  # where it belongs
        self.unit_loc_x = base.base_loc_x
        self.unit_loc_y = base.base_loc_y
        self.unit_id = unit_json["unit_id"]
        self.speed = unit_json["unit_speed"]
        self.range = unit_json["unit_range"]
        self.munitions_ls = []

        munitions_json_ls = unit_json["munitions"]
        for munition_json in munitions_json_ls:
            munition = Munition(self, munition_json)
            self.munitions_ls.append(munition)

    def get_munitions(self):
        return self.munitions_ls


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


class GameState:
    def __init__(self, config):
        # construct the bases
        bases_json_ls = config["bases"]
        self.bases_ls = []
        self.units_ls = []
        self.munitions_ls = []
        self.time = 0

        # initialize everything
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

    def print_status(self):
        for base in self.bases_ls:
            print(base.base_name)
        for unit in self.units_ls:
            print(unit.unit_id)
        for munition in self.munitions_ls:
            print(munition.munition_id)

    def get_bases(self):
        return self.bases_ls

    def get_named_base(self, name):
        for base in self.bases_ls:
            if base.base_name == name:
                return base
            else:
                print("base not found")

        """
        unit_ls = self.get_units() # gets all units from the bases 
        missile_ls = self.get_missiles() # gets all missiles
        """


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
        self.game_state.print_status()
        print("hi")

    def reset(self):
        pass
        # return initial_state

    def step(self, action):
        base = action.base_chosen

        chosen_base = self.game_state.get_named_base(base)
        print(chosen_base.base_name)

        # so we go into the actions and make them happen. For example,

        """"""
        pass
        # new_state, rewards = process_actions(actions)
        # return new_state, rewards
