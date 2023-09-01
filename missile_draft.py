import tkinter as tk
from PIL import Image, ImageTk
import random

class Dot:
    def __init__(self, canvas, x, y, color="red", size=10):
        self.canvas = canvas
        self.x = x
        self.y = y
        self.id = self.canvas.create_oval(x, y, x+size, y+size, fill=color)
    
    def move(self, dx, dy):
        self.canvas.move(self.id, dx, dy)

    def move_towards(self, target, fraction=0.1):
        x1, y1, _, _ = self.canvas.coords(self.id)
        x2, y2, _, _ = self.canvas.coords(target.id)

        x_diff = (x2 - x1) * fraction
        y_diff = (y2 - y1) * fraction

        self.move(x_diff, y_diff)

    def move_away_from(self, target, distance=10):
        x, y, _, _ = self.canvas.coords(self.id)
        tx, ty, _, _  = self.canvas.coords(target.id)
        dist = ((tx - x)**2 + (ty - y)**2)**0.5
        if dist == 0:  # Avoid dividing by zero
            return
        x_dir = (x - tx) / dist
        y_dir = (y - ty) / dist

        self.move(x_dir * distance, y_dir * distance)

    def keep_within_bounds(self):
        x, y, x_end, y_end = self.canvas.coords(self.id)
        if x < 0:
            self.move(-x, 0)
        if y < 0:
            self.move(0, -y)
        if x_end > 500:
            self.move(500 - x_end, 0)
        if y_end > 500:
            self.move(0, 500 - y_end)

class Missile(Dot):
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

class MovingDots:
    def __init__(self, master, image_path):
        self.master = master
        self.canvas = tk.Canvas(self.master, bg='white', width=500, height=500)
        self.canvas.pack()

        self.image = Image.open(image_path)
        self.image = self.image.resize((500, 500))
        self.tk_image = ImageTk.PhotoImage(self.image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.tk_image)
        
        self.dot1 = Dot(self.canvas, 100, 100, color="blue")
        self.dot2 = Dot(self.canvas, 200, 200, color="red")
        self.dot3 = Dot(self.canvas, 300, 300, color="green")

        self.missile = Missile(self.canvas, 300, 300, self.dot2)

        self.move_entities()

    def move_entities(self):
        dx, dy = random.randint(-10, 10), random.randint(-10, 10)
        self.dot2.move(dx, dy)
        
        self.dot1.move_towards(self.dot2)
               
        # Make Dot 2 maintain a distance from Dot 1
        x1, y1, _, _ = self.dot1.canvas.coords(self.dot1.id)
        x2, y2, _, _ = self.dot2.canvas.coords(self.dot2.id)

        distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5
        #print(x2, y2)
        if distance < 50:
            self.dot2.move_away_from(self.dot1)

        if self.missile.move_missile():  # Check if missile hit the target
            # Create a new missile targeting dot2
            self.missile = Missile(self.canvas, 300, 300, self.dot2)

        self.dot1.keep_within_bounds()
        self.dot2.keep_within_bounds()
        self.dot3.keep_within_bounds()
        self.missile.keep_within_bounds()

        self.master.after(100, self.move_entities)

root = tk.Tk()
app = MovingDots(root, "./map.jpg")
root.mainloop()
