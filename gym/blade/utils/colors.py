from enum import Enum


class SIDE_COLOR(Enum):
    RED = "red"
    BLUE = "blue"
    GREEN = "green"
    ORANGE = "orange"
    PURPLE = "purple"
    YELLOW = "yellow"
    PINK = "pink"
    TEAL = "teal"
    CYAN = "cyan"
    LIME = "lime"
    BROWN = "brown"
    GRAY = "gray"
    BLACK = "black"
    WHITE = "white"
    MAGENTA = "magenta"
    PLUM = "plum"
    LIGHT_GREEN = "lightgreen"
    DARK_RED = "darkred"
    DARK_BLUE = "darkblue"
    DARK_GREEN = "darkgreen"
    GOLD = "gold"
    SILVER = "silver"
    NAVY = "navy"
    MAROON = "maroon"
    OLIVE = "olive"
    CORAL = "coral"
    TURQUOISE = "turquoise"
    INDIGO = "indigo"
    BEIGE = "beige"
    SALMON = "salmon"
    SKY_BLUE = "skyblue"
    AQUAMARINE = "aquamarine"

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
