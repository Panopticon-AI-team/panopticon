class StateSummarizer:
    def __init__(self, state):
        self.gs = state
        self.bases_ls = self.gs.get_bases()
        self.units_ls = self.gs.get_units()
        self.munitions_ls = self.gs.get_munitions()

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
