import tkinter as tk
from PIL import Image, ImageTk
import random


class MovingDots:
    def __init__(self, master, image_path):
        self.master = master
        self.canvas = tk.Canvas(self.master, bg="white", width=500, height=500)
        self.canvas.pack()

        # Load and display the image
        self.image = Image.open(image_path)
        self.image = self.image.resize((500, 500))  # resize image to fit canvas
        self.tk_image = ImageTk.PhotoImage(self.image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.tk_image)

        # Create 3 dots on the canvas
        self.dot1 = self.canvas.create_oval(100, 100, 110, 110, fill="blue")
        self.dot2 = self.canvas.create_oval(200, 200, 210, 210, fill="red")
        self.dot3 = self.canvas.create_oval(300, 300, 310, 310, fill="green")

        self.move_dots()

    def keep_within_bounds(self, dot):
        x, y, x_end, y_end = self.canvas.coords(dot)

        if x < 0:
            self.canvas.move(dot, -x, 0)
        if y < 0:
            self.canvas.move(dot, 0, -y)
        if x_end > 500:
            self.canvas.move(dot, 500 - x_end, 0)
        if y_end > 500:
            self.canvas.move(dot, 0, 500 - y_end)

    def move_dots(self):
        # Random movement for dot2
        x2, y2 = random.randint(-10, 10), random.randint(-10, 10)
        self.canvas.move(self.dot2, x2, y2)

        # Random movement for dot3
        x3, y3 = random.randint(-10, 10), random.randint(-10, 10)
        self.canvas.move(self.dot3, x3, y3)

        # Make Dot 2 move towards Dot 3
        x2, y2, _, _ = self.canvas.coords(self.dot1)
        x3, y3, _, _ = self.canvas.coords(self.dot2)

        # Calculate the difference
        x_diff = (
            x3 - x2
        ) * 0.1  # Multiply by 0.1 to move Dot 2 by a fraction of the distance to Dot 3
        y_diff = (y3 - y2) * 0.1

        self.canvas.move(self.dot1, x_diff, y_diff)

        # Make Dot 2 maintain a distance from Dot 1
        x1, y1, _, _ = self.canvas.coords(self.dot1)
        x2, y2, _, _ = self.canvas.coords(self.dot2)

        # Calculate distance between Dot 1 and Dot 2
        distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5

        # If the distance is less than a threshold (e.g., 50 pixels), move Dot 2 away from Dot 1
        if distance < 50:
            # Calculate direction vector (normalized)
            x_dir = (x2 - x1) / distance
            y_dir = (y2 - y1) / distance

            # Move Dot 2 away from Dot 1 by a fraction (e.g., 10 pixels)
            self.canvas.move(self.dot2, x_dir * 10, y_dir * 10)

        for dot in (self.dot1, self.dot2, self.dot3):
            self.keep_within_bounds(dot)

        # Call move_dots() again after 100ms
        self.master.after(100, self.move_dots)


root = tk.Tk()
app = MovingDots(root, "./resources/map.jpg")
root.mainloop()
