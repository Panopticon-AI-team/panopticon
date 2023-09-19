import math


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


class ActionHandler:
    def __init__(self, state):
        self.game_state = state
        pass

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

    def unit_action(self, action, unit):
        unit.action = action.unit_action
        unit.target = action.unit_target

        if unit.action == "moveto":
            x1, y1 = unit.unit_loc_x, unit.unit_loc_y
            x2, y2 = unit.target.get_loc()
            dx, dy = self.compute_deltas(x1, y1, x2, y2, unit.speed)

            unit.unit_loc_x = unit.unit_loc_x + dx
            unit.unit_loc_y = unit.unit_loc_y + dy
        else:
            print("some other action was selected, not implemented yet")

    def base_action(self, a):
        chosen_unit = a.unit_chosen
        gs = self.game_state

        for unit in gs.units_ls:
            if unit.unit_id == chosen_unit:
                self.unit_action(a, unit)
                return unit
            else:
                print("unit not found")

    def get_named_base(self, base_chosen_name):
        print("the base chosen is " + base_chosen_name)
        bases_ls = self.game_state.bases_ls

        for base in bases_ls:
            print(base.get_base_name())
            # if it equals a name of the base in the list
            if base.get_base_name() == base_chosen_name:
                print("found the base")
                return base

    def apply_action(self, action):
        # logic to update the state based on the action
        a = action

        # preprocessing for actions to get base/tgt objects, relies on other fun
        print(a)
        a.base_chosen = self.get_named_base(a.base_chosen)
        a.unit_target = self.get_named_base(a.unit_target)

        # go further into the action tree
        self.base_action(a)

        updated_state = ...
        return updated_state
