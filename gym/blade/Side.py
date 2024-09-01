from blade.utils.constants import DEFAULT_SIDE_COLOR


class Side:
    def __init__(
        self,
        id: str,
        name: str,
        total_score: int = 0,
        side_color: str = DEFAULT_SIDE_COLOR,
    ):
        self.id = id
        self.name = name
        self.total_score = total_score
        self.side_color = side_color
