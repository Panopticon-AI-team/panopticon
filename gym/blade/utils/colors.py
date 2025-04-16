from enum import Enum


class SIDE_COLOR(Enum):
    BLACK = "black"
    WHITE = "white"
    GRAY = "gray"
    SILVER = "silver"
    BEIGE = "beige"
    BROWN = "brown"
    MAROON = "maroon"
    RED = "red"
    DARKRED = "darkred"
    CORAL = "coral"
    SALMON = "salmon"
    ORANGE = "orange"
    GOLD = "gold"
    YELLOW = "yellow"
    OLIVE = "olive"
    LIME = "lime"
    LIGHTGREEN = "lightgreen"
    GREEN = "green"
    DARKGREEN = "darkgreen"
    AQUAMARINE = "aquamarine"
    TEAL = "teal"
    TURQUOISE = "turquoise"
    CYAN = "cyan"
    SKYBLUE = "skyblue"
    BLUE = "blue"
    DARKBLUE = "darkblue"
    NAVY = "navy"
    INDIGO = "indigo"
    PURPLE = "purple"
    PLUM = "plum"
    MAGENTA = "magenta"
    PINK = "pink"

    def upper(self):
        return self.name.upper()


def convert_color_name_to_side_color(
    color: str | None, return_if_error: SIDE_COLOR = SIDE_COLOR.BLACK
) -> SIDE_COLOR:
    if not color:
        return return_if_error

    color_key = color.upper()
    try:
        return SIDE_COLOR[color_key]
    except KeyError:
        return return_if_error
