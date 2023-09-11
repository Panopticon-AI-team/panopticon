import tkinter as tk
from PIL import Image, ImageTk
import random
from asset import Asset


class Missile(Asset):
    def __init__(self, canvas, x, y, target, speed=15):
        super().__init__(canvas, x, y, color="black", size=5)
        self.target = target
        self.speed = speed  # this determines the constant speed of the missile

    def move_missile(self):
        # Calculate the difference between missile and target coordinates
        x1, y1, _, _ = self.canvas.coords(self.id)
        x2, y2, _, _ = self.canvas.coords(self.target.id)
        
        dx = x2 - x1
        dy = y2 - y1
        
        # Calculate the distance using the Pythagorean theorem
        distance = (dx**2 + dy**2)**0.5

        # Normalize the difference to get the direction
        if distance == 0:  # To prevent division by zero
            return False
        dx /= distance
        dy /= distance
        
        # Move by the fixed step size (speed) in the direction
        self.move(dx * self.speed, dy * self.speed)
        
        # Recalculate the distance after the move
        x1, y1, _, _ = self.canvas.coords(self.id)
        distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5
        if distance < 10:
            self.canvas.delete(self.id)
            return True  # Indicate that missile hit the target
        
        return False  # Indicate that missile is still in transit

class MovingAssets:
    def __init__(self, master, image_path, width=500, height =500):
        self.master = master
        self.canvas = tk.Canvas(self.master, bg='white', width=500, height=500)
        self.width = width
        self.height = height
        self.canvas.pack()

        self.image = Image.open(image_path)
        self.image = self.image.resize((500, 500))
        self.tk_image = ImageTk.PhotoImage(self.image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.tk_image)

        self.red_forces, self.blue_forces = self.init_units()
        

        '''
        '''
        self.Asset1 = Asset(self.canvas, 100, 100, color="darkgoldenrod2")
        self.Asset2 = Asset(self.canvas, 200, 200, color="olive drab", speedmult = 1.5)
        self.Asset3 = Asset(self.canvas, 300, 300, color="yellow", speedmult=.2)

        self.missile = Missile(self.canvas, 300, 300, self.Asset2)

        self.move_entities()


    def init_units(self):
        red_ct = 3
        blue_ct = 4
        red_force_arr = [0]  * red_ct
        blue_force_arr = [0]  * blue_ct

        for i in range(red_ct):
            red_force_arr[i] = Asset(self.canvas, 150 + i, 150 + i, color="red")

        for i in range(blue_ct):
            blue_force_arr[i] = Asset(self.canvas, 250 + i, 150 + i, color="blue")

        forces = red_force_arr, blue_force_arr

        return forces


    def move_entities(self):
        dx, dy = random.randint(-2, 2), random.randint(-2, 2)

        for unit_num in range(len(self.red_forces)):
            dx, dy = random.randint(-2, 2), random.randint(-2, 2)
            self.red_forces[unit_num].move(dx, dy)
        for unit_num in range(len(self.blue_forces)):
            dx, dy = random.randint(-2, 2), random.randint(-2, 2)
            self.blue_forces[unit_num].move(dx, dy)

        self.Asset2.move(dx, dy)
        self.Asset1.move_asset(self.Asset2,mode="To")
        self.Asset3.move_asset(self.Asset2, mode="To") # moving green thing
               
        # Make Asset 2 maintain a distance from Asset 1
        x1, y1, _, _ = self.Asset1.canvas.coords(self.Asset1.id)
        x2, y2, _, _ = self.Asset2.canvas.coords(self.Asset2.id)
        x3, y3, _, _ = self.Asset3.canvas.coords(self.Asset3.id)

        distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5

        if distance < 50:
            self.Asset2.move_asset(self.Asset1, mode="Away")

        if self.missile.move_missile():  # Check if missile hit the target
            # Create a new missile targeting Asset2
            self.missile = Missile(self.canvas, x3, y3, self.Asset2)

        self.Asset1.keep_within_bounds(self.width, self.height)
        self.Asset2.keep_within_bounds(self.width, self.height)
        self.Asset3.keep_within_bounds(self.width, self.height)
        self.missile.keep_within_bounds(self.width, self.height)

        self.master.after(100, self.move_entities)

def main():
    root = tk.Tk()
    app = MovingAssets(root, "./map.jpg", 500, 500)
    root.mainloop()

if __name__ == "__main__":
    main()


