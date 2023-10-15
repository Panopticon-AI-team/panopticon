import tkinter as tk
from PIL import Image, ImageTk
import random


class Canvas:
    def __init__(self, master, image_path):
        self.master = master
        self.canvas = tk.Canvas(self.master, bg="white", width=500, height=500)
        self.canvas.pack()

        # Load and display the image
        self.image = Image.open(image_path)
        self.image = self.image.resize((500, 500))  # resize image to fit canvas
        self.tk_image = ImageTk.PhotoImage(self.image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.tk_image)

        self.dot1 = self.canvas.create_oval(100, 100, 110, 110, fill="blue")

    def draw_unit(self, x, y):
        self.unit = self.canvas.create_oval(x, x, y, y, fill="blue")
