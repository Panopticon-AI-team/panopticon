import json
from blade.utils.colors import convert_color_name_to_side_color, SIDE_COLOR


class Side:

    def __init__(
        self,
        id: str,
        name: str,
        total_score: int = 0,
        color: str | SIDE_COLOR | None = None,
    ):
        self.id = id
        self.name = name
        self.total_score = total_score
        self.color = convert_color_name_to_side_color(color)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)
