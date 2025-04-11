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

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "total_score": self.total_score,
            "color": (
                self.color.value if isinstance(self.color, SIDE_COLOR) else self.color
            ),
        }
