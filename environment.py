""" 
lists all the classes and stuff. this is an important file
"""
import json
import math
import copy


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
        self.target = None
        self.state = None

        munitions_json_ls = unit_json["munitions"]
        for munition_json in munitions_json_ls:
            munition = Munition(self, munition_json)
            self.munitions_ls.append(munition)

    def get_munitions(self):
        return self.munitions_ls

    def compute_deltas(self, x1, y1, x2, y2, s):
        # Vector from (x1, y1) to (x2, y2)
        v = (x2 - x1, y2 - y1)

        # Magnitude of V
        mag_v = math.sqrt(v[0] ** 2 + v[1] ** 2)

        # Handle the case when the two points are the same
        if mag_v == 0:
            return (0, 0)

        # Vector U with magnitude s pointing in the same direction as V
        dx, dy = (s * v[0] / mag_v, s * v[1] / mag_v)

        return dx, dy

    def handle_action(self, action):
        self.action = action.unit_action
        self.target = action.unit_target

        if self.action == "moveTo":
            x1, y1 = self.unit_loc_x, self.unit_loc_y
            x2, y2 = self.target.get_loc()
            dx, dy = self.compute_deltas(x1, y1, x2, y2, self.speed)

            self.unit_loc_x = self.unit_loc_x + dx
            self.unit_loc_y = self.unit_loc_y + dy
        else:
            print("some other action was selected, not implemented yet")


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

    def handle_action(self, action):
        chosen_unit = action.unit_chosen

        for unit in self.units_ls:
            if unit.unit_id == chosen_unit:
                unit.handle_action(action)
                return unit
            else:
                print("unit not found")


class GameState:
    def __init__(self, config):
        # construct the bases
        bases_json_ls = config["bases"]
        self.bases_ls = []
        self.units_ls = []
        self.munitions_ls = []

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

    def print_unit_coordinates(self):
        for unit in self.units_ls:
            print(f"The unit {unit.unit_id} is at {unit.unit_loc_x} {unit.unit_loc_y}")

    def get_bases(self):
        return self.bases_ls

    def get_named_base(self, base_chosen_name):
        print("the base chosen is " + base_chosen_name)
        for base in self.bases_ls:
            print(base.get_base_name())
            # if it equals a name of the base in the list
            if base.get_base_name() == base_chosen_name:
                print("found the base")
                return base

                # print("base not found")

    def handle_action(self, action):
        # preprocessing for actions to get base/tgt objects, relies on other fun
        print(action)
        action.base_chosen = self.get_named_base(action.base_chosen)
        action.unit_target = self.get_named_base(action.unit_target)

        # go further into the action tree

        action.base_chosen.handle_action(action)

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
        self.time = 0
        print("hi")

    def reset(self):
        pass
        # return initial_state

    def step(self, actions):
        # action pre-processing steps
        action, action1 = actions

        print("taking actions")
        self.game_state.print_unit_coordinates()

        self.game_state.handle_action(action)
        self.game_state.print_unit_coordinates()
        self.game_state.handle_action(copy.deepcopy(action1))
        self.game_state.print_unit_coordinates()
        self.game_state.handle_action(copy.deepcopy(action1))
        self.game_state.print_unit_coordinates()
        print("action handled...?")

        self.time = self.time + 1

        # so we go into the actions and make them happen. For example,

        """"""
        pass
        # new_state, rewards = process_actions(actions)
        # return new_state, rewards
