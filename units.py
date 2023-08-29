'''

REVOLUTIONIZING THE ART OF WAR

'''

class Asset:
    def __init__(self, id, speed, type, loadout):
        self.id = id
        self.speed = speed
        self.destroyed = False
        self.type = "" # Navy or Air
        self.munitions = None # set of munitions
        self.home_base = None # (x,y), euclidian
        self.location = None # geo coordinates
        self.range = None #This is a timer that will count down every second in the air

    def attack(self, tgt):
        pass # attack the targeted unit through pursuit

    def launch(self):
        pass # launch from a base

    def loiter(self, coord):
        pass # make circles in the air around certain coordinates

    def rtb(self):
        pass # return to the original base by moving the coordinates

    def get_asset_coord(self):
        return self.location

class Base:
    def __init__(self, id, type, coordinates, health=100):
        self.id = id
        self.type = "" # Navy or Air
        self.coordinates = None 
        self.health = health # default 100
        self.destroyed = False

    def takes_damage(self, damage):
        self.health = self.health - damage

class Munition:
    def __init__(self, id, speed, pk = .75, damage = 20):
        self.id = id
        self.type = speed
        self.location = None 
        self.pk = pk
        self.damage = damage

    # launches at a specific target
    def launch(self, tgt):
        self.location = get_asset_coord()
        pass 

    def move_to_target(self):
        # location updates according to speed and target
        pass
