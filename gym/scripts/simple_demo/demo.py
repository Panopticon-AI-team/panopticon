import os
import gymnasium
import blade
from blade.Game import Game
from blade.Scenario import Scenario

demo_folder = "/home/panopticon/fork_panopticon/gym/scripts/simple_demo"

game = Game(current_scenario=Scenario())
with open(f"{demo_folder}/simple_demo.json", "r") as scenario_file:
    game.load_scenario(scenario_file.read())

env = gymnasium.make("blade/BLADE-v0", game=game)

observation, info = env.reset()
env.unwrapped.pretty_print(observation)
env.unwrapped.game.record_scenario_start()

def simple_scripted_agent(observation):
    sample_launch_aircraft_action = "launch_aircraft_from_airbase('05dbcb4c-dcf8-4125-ba2e-3a6fce8b33a3')"
    launched_aircraft_id = "fbcaa81c-bb50-470b-9e6d-81cd825b1fd0"
    first_target_position = [10.9, -22.7]
    first_move_aircraft_action = f"move_aircraft('{launched_aircraft_id}', [[{first_target_position[0]}, {first_target_position[1]}]])"
    second_target_position = [15.75, -8.97]
    second_move_aircraft_action = f"move_aircraft('{launched_aircraft_id}', [[{second_target_position[0]}, {second_target_position[1]}]])"
    red_target_id = "e0d4547d-9921-4580-bef9-5026f371cb9e"
    attack_target_action = f"handle_aircraft_attack('{launched_aircraft_id}', '{red_target_id}')"
    return_to_base_action = f"aircraft_return_to_base('{launched_aircraft_id}')"

    start_time = observation.start_time
    current_time_step = observation.current_time - start_time
    launched_aircraft = None
    aircraft = [ac for ac in observation.aircraft if ac.id == launched_aircraft_id]
    if len(aircraft) > 0:
        launched_aircraft = aircraft[0]
    if current_time_step == 0: # launch an aircraft from the BLUE airbase
        return sample_launch_aircraft_action
    elif current_time_step == 1: # move the launched aircraft to (10.9, -22.7) at timestep 1
        return first_move_aircraft_action
    elif launched_aircraft != None and \
        launched_aircraft.latitude > 15 and \
        launched_aircraft.longitude > -11: # make the aircraft return to base after it has infiltrated the enemy airbase
        return return_to_base_action
    elif launched_aircraft != None and \
        launched_aircraft.latitude > 10 and \
        launched_aircraft.longitude > -23: # move the launched aircraft to (16.05, -8.97) after destroying the red target:
        return second_move_aircraft_action
    elif launched_aircraft != None and \
        launched_aircraft.latitude > 0 and \
        launched_aircraft.longitude > -33: # attack the red target when aircraft is near (10.9, -22.7)
        return attack_target_action # launch missiles
    else:
        return ""
    
for filename in os.listdir(demo_folder):
    if filename.endswith(".json") and "simple_demo_t" in filename:
        os.remove(f"{demo_folder}/{filename}")

steps = 35000
for step in range(steps):
    action = simple_scripted_agent(observation)
    observation, reward, terminated, truncated, info = env.step(action = action)
    # env.unwrapped.pretty_print(observation)
    if step == 10000: # should see weapon launch here
        env.unwrapped.export_scenario(f"{demo_folder}/simple_demo_t{step}.json")
    elif step == 20000: # red aircraft should be destroyed
        env.unwrapped.export_scenario(f"{demo_folder}/simple_demo_t{step}.json")
    elif step == 30000: # blue aircraft should be near enemy airbase if it did not get destroyed
        env.unwrapped.export_scenario(f"{demo_folder}/simple_demo_t{step}.json")
env.unwrapped.game.record_scenario_stop(compression=True)
env.unwrapped.export_scenario(f"{demo_folder}/simple_demo_t{steps}.json") # blue aircraft should be returning to base
