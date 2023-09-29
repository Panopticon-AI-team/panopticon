"""
Old test code. this method wont work as its too simplistic
"""


class Asset:
    def __init__(self, canvas, x, y, color="red", size=10, speedmult=1):
        self.canvas = canvas
        self.speedmult = speedmult
        self.x = x
        self.y = y
        self.id = self.canvas.create_oval(x, y, x + size, y + size, fill=color)

    # actually moves the thing
    def move(self, dx, dy):
        self.canvas.move(self.id, dx, dy)

    # calculates the distace between self and target, then moves toward
    # TODO this should not be a fraction... it should be constant, like the missile
    def move_asset(self, target, fraction=0.1, mode="To"):
        if mode == "To":
            dir = 1
        elif mode == "Away":
            dir = -1
        else:
            return

        x1, y1, _, _ = self.canvas.coords(self.id)
        x2, y2, _, _ = self.canvas.coords(target.id)

        x_diff = (x2 - x1) * fraction * self.speedmult * dir
        y_diff = (y2 - y1) * fraction * self.speedmult * dir

        self.move(x_diff, y_diff)

    def keep_within_bounds(self, w, h):
        x, y, x_end, y_end = self.canvas.coords(self.id)

        if x < 0:
            self.move(-x, 0)
        if y < 0:
            self.move(0, -y)
        if x_end > w:
            self.move(w - x_end, 0)
        if y_end > h:
            self.move(0, h - y_end)


class Missile(Asset):
    def __init__(self, canvas, x, y, target, speed=10):
        super().__init__(canvas, x, y, color="black", size=5)
        self.target = target
        self.speed = speed  # this determines the constant speed of the missile

    def return_target(self):
        return self.target

    def move_missile(self):
        # Calculate the difference between missile and target coordinates
        x1, y1, _, _ = self.canvas.coords(self.id)
        x2, y2, _, _ = self.canvas.coords(self.target.id)

        dx = x2 - x1
        dy = y2 - y1

        # Calculate the distance using the Pythagorean theorem
        distance = (dx**2 + dy**2) ** 0.5

        # Normalize the difference to get the direction
        if distance == 0:  # To prevent division by zero
            return False
        dx /= distance
        dy /= distance

        # Move by the fixed step size (speed) in the direction
        self.move(dx * self.speed, dy * self.speed)

        # Recalculate the distance after the move
        x1, y1, _, _ = self.canvas.coords(self.id)
        distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
        if distance < 10:
            self.canvas.delete(self.id)
            return True  # Indicate that missile hit the target

        return False  # Indicate that missile is still in transit
