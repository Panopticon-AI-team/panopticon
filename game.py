import tkinter as tk
from PIL import Image, ImageTk
import random
from asset import Asset, Missile


class MovingAssets:
    def __init__(self, master, image_path, width, height):
        self.master = master
        self.canvas = tk.Canvas(self.master, bg="white", width=width, height=height)
        self.width = width
        self.height = height
        self.canvas.pack()

        self.image = Image.open(image_path)
        #self.image = self.image.resize((500, 500))
        self.tk_image = ImageTk.PhotoImage(self.image)
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.tk_image)

        self.red_forces, self.blue_forces = self.init_units()

        # assign target map
        self.red_to_blue_tgt = self.assign_targets()

        # assign missile targets
        self.missiles = self.init_missiles()
        
        '''
        self.Asset1 = Asset(self.canvas, 100, 100, color="darkgoldenrod2")
        self.Asset2 = Asset(self.canvas, 200, 200, color="olive drab", speedmult = 1.5)
        self.Asset3 = Asset(self.canvas, 300, 300, color="yellow", speedmult=.2)
        self.missile = Missile(self.canvas, 300, 300, self.Asset2)
        '''

        self.move_entities()

    def init_missiles(self):
        missile_arr = []

        # get position of each asset. this is the origin of the missile.
        # create the missile in the array 
        for i in range(len(self.red_forces)):
            red_unit = self.red_forces[i]
            x, y, _, _ = red_unit.canvas.coords(red_unit.id)
            blue_tgt_num = self.red_to_blue_tgt[i]
            tgt = self.blue_forces[blue_tgt_num]

            missile = Missile(self.canvas, x, y, tgt)
            missile_arr.append(missile)
    
        return missile_arr


    def init_units(self):
        red_ct = 30
        blue_ct = 30
        red_force_arr = [0]  * red_ct
        blue_force_arr = [0]  * blue_ct

        for i in range(red_ct):
            red_force_arr[i] = Asset(self.canvas, 150 + i, 150 + i, color="red", speedmult= .8)

        for i in range(blue_ct):
            blue_force_arr[i] = Asset(self.canvas, 250 + i, 150 + i, color="blue", speedmult=1.4)

        forces = red_force_arr, blue_force_arr

        return forces

    def assign_targets(self):

        ct_red_forces = len(self.red_forces)
        ct_blue_forces = len(self.blue_forces)
        red_to_blue_tgt = {}

        for i in range(ct_red_forces):
            red_to_blue_tgt[i] = random.randint(0, ct_blue_forces-1)
        return red_to_blue_tgt

    def calc_distance(self, unit, tgt):
        x1, y1, _, _ = unit.canvas.coords(unit.id)
        x2, y2, _, _ = tgt.canvas.coords(tgt.id)

        distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5
        return distance
    
    # find the closest of the ones
    def calc_closest(self, blue_unit):
        distances = []

        for i in range(len(self.red_forces)):
            dist = self.calc_distance(blue_unit, self.red_forces[i])
            distances.append(dist)

        return min(distances), distances.index(min(distances))

    def move_entities(self):
        dx, dy = random.randint(-2, 2), random.randint(-2, 2)

        for unit_num in range(len(self.blue_forces)):
            dx, dy = random.randint(-2, 2), random.randint(-2, 2)
            self.blue_forces[unit_num].move(dx, dy)

        # Make the red forces move towards a random blue unit
        for unit_num in range(len(self.red_forces)):
            dx, dy = random.randint(-2, 2), random.randint(-2, 2)
            self.red_forces[unit_num].move(dx, dy)
            
            # map from each red unit to their blue unit
            blue_tgt = self.blue_forces[self.red_to_blue_tgt[unit_num]]
            self.red_forces[unit_num].move_asset(blue_tgt, mode="To")

        # make the blue force move from closest red unit
        for unit_num in range(len(self.blue_forces)):
            blue_unit = self.blue_forces[unit_num]

            distance, red_unit_num = self.calc_closest(blue_unit)
            red_unit = self.red_forces[red_unit_num]

            if distance < 50:
                # delete print(distance, " blue")
                # map from each red unit to their blue unit
                blue_unit.move_asset(red_unit, mode="Away")
            else:
                blue_unit.move(dx, dy)


        # it's a list of missiles of red. 
        # must reference right one to construct if it is used up.
        for i in range(len(self.missiles)):
            #print(i), print(len(self.missiles))
            missile = self.missiles[i]
            if missile.move_missile():
                red_shooter = self.red_forces[i]

                x, y, _, _ = red_shooter.canvas.coords(red_shooter.id)
                missile = Missile(self.canvas, x, y, missile.return_target())
                self.missiles[i] = missile
                #print("new missile created")
        
        all_assets = self.blue_forces + self.red_forces
        for asset in all_assets:
            asset.keep_within_bounds(self.width, self.height)

        '''
        self.Asset2.move(dx, dy)
        self.Asset1.move_asset(self.Asset2,mode="To")
        self.Asset3.move_asset(self.Asset2, mode="To") # moving green thing
               
        # Make Asset 2 maintain a distance from Asset 1
        x1, y1, _, _ = self.Asset1.canvas.coords(self.Asset1.id)
        x2, y2, _, _ = self.Asset2.canvas.coords(self.Asset2.id)
        x3, y3, _, _ = self.Asset3.canvas.coords(self.Asset3.id)

        distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5

        if distance < 50:
            #print(distance, " before")
            self.Asset2.move_asset(self.Asset1, mode="Away")
        if self.missile.move_missile():  # Check if missile hit the target
            # Create a new missile targeting Asset2
            self.missile = Missile(self.canvas, x3, y3, self.Asset2)



        self.Asset1.keep_within_bounds(self.width, self.height)
        self.Asset2.keep_within_bounds(self.width, self.height)
        self.Asset3.keep_within_bounds(self.width, self.height)
        self.missile.keep_within_bounds(self.width, self.height)
        '''

        self.master.after(50, self.move_entities)

def main():
    root = tk.Tk()
    app = MovingAssets(root, "./world-map.gif", 1200, 715)
    root.mainloop()

if __name__ == "__main__":
    main()


