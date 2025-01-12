import gymnasium
import numpy as np
from blade.Game import Game
from blade.Scenario import Scenario
from stable_baselines3 import PPO
from gymnasium.spaces import Box
from blade.utils.utils import get_bearing_between_two_points

DEBUG = False
demo_folder = "."

game = Game(current_scenario=Scenario())
with open(f"{demo_folder}/scen.json", "r") as scenario_file:
    game.load_scenario(scenario_file.read())

observation_space = Box(
    low=np.array([-90.0, -180.0]), high=np.array([90.0, 180.0]), dtype=np.float64
)
action_space = Box(
    low=np.array([-90.0, -180.0]), high=np.array([90.0, 180.0]), dtype=np.float64
)


def action_transform_fnc(observation: Scenario, action: np.ndarray):
    aircraft = observation.aircraft[0]
    start_latitude = aircraft.latitude
    start_longitude = aircraft.longitude

    aircraft.black_box.log(
        timestamp=0,
        latitude=start_latitude,
        longitude=start_longitude,
        heading=get_bearing_between_two_points(
            start_latitude=start_latitude,
            start_longitude=start_longitude,
            destination_latitude=action[0],
            destination_longitude=action[1],
        ),
        speed=aircraft.speed,
        fuel=aircraft.current_fuel,
    )
    if DEBUG:
        print(f"log: {aircraft.black_box.get_last_log_pp()}")

    action = f"move_aircraft('{aircraft.id}', {action[0]}, {action[1]})"
    return action


def observation_filter_fnc(observation: Scenario):
    aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
    if aircraft == None:
        return np.array([0, 0])
    return np.array([aircraft.latitude, aircraft.longitude])


def euclidean_distance(start_coord, end_coord):
    return np.sqrt(
        (end_coord[0] - start_coord[0]) ** 2 + (end_coord[1] - start_coord[1]) ** 2
    )


def reward_filter_fnc(observation: Scenario):
    def mean_squared_change(values):
        differences = np.abs(np.diff(values))
        differences = np.where(differences > 180, 360 - differences, differences)
        return np.mean(differences**2) if len(differences) > 0 else 0

    # this is alternate method for quantifying variance in prev aircraft headings
    def smoothness_index(values):
        differences = np.diff(values)
        differences = np.where(differences > 180, 360 - differences, differences)

        total_variation = np.sum(differences)
        std_dev = np.std(differences)
        return total_variation / (std_dev + 1e-8) if len(differences) > 0 else 0

    aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
    goal_coordinates = [4.5, 5.5]

    if aircraft is None:
        return -float("inf")

    previous_log = aircraft.black_box.get_last_log()
    previous_latitude = previous_log.get("latitude")
    previous_longitude = previous_log.get("longitude")
    previous_heading = previous_log.get("heading")

    previous_distance = euclidean_distance(
        [previous_latitude, previous_longitude], goal_coordinates
    )
    current_distance = euclidean_distance(
        [aircraft.latitude, aircraft.longitude], goal_coordinates
    )

    scaling_factors = {
        "distance": 10,
        "exp_progress": 100,
        "heading_align": 5,
        "heading_smoothness": 0.001,
    }

    # Distance-related rewards
    distance_progress_reward = scaling_factors.get("distance") * (
        previous_distance - current_distance
    )
    exponential_reward = np.exp(-current_distance) * scaling_factors.get("exp_progress")

    # Heading alignment reward
    target_heading = get_bearing_between_two_points(
        aircraft.latitude, aircraft.longitude, goal_coordinates[0], goal_coordinates[1]
    )
    heading_difference = abs((previous_heading - target_heading + 180) % 360 - 180)
    heading_alignment_reward = (1 - heading_difference / 180.0) * scaling_factors.get(
        "heading_align"
    )

    headings = [
        log_entry["heading"]
        for log_entry in aircraft.black_box._logs
        if "heading" in log_entry
    ]
    heading_smoothness_penalty = -mean_squared_change(headings) * scaling_factors.get(
        "heading_smoothness"
    )

    total_reward = (
        distance_progress_reward
        # + exponential_reward
        + heading_alignment_reward
        + heading_smoothness_penalty
    )

    if DEBUG:
        print(f"Reward Breakdown |-------------------------------------------")
        print(f"  Distance Progress Reward: {distance_progress_reward}")
        # print(f"  Exponential Reward: {exponential_reward}")
        print(f"  Heading Alignment Reward: {heading_alignment_reward}")
        print(f"  Heading Smoothness Penalty: {heading_smoothness_penalty}")
        print(f"  Total Reward: {total_reward}")
        print(f"------------------------------------------------------------")

    return total_reward


def termination_filter_fnc(observation: Scenario):
    aircraft = observation.aircraft[0] if len(observation.aircraft) > 0 else None
    goal_coordinates = [4.5, 5.5]

    if aircraft == None:
        distance = 0
    else:
        distance = euclidean_distance(
            [aircraft.latitude, aircraft.longitude], goal_coordinates
        )

    terminated = distance < 0.1
    return terminated


def evaluate_agent(model, env, num_episodes=1):
    total_rewards = []
    for _ in range(num_episodes):
        obs, _ = env.reset()
        episode_reward = 0
        done = False
        while not done:
            action, _ = model.predict(obs)
            obs, reward, terminated, truncated, _ = env.step(action)
            episode_reward += reward
            done = terminated or truncated

        env.unwrapped.export_scenario(f"{demo_folder}/scen_x.json")

        total_rewards.append(episode_reward)
    return np.mean(total_rewards), np.std(total_rewards)


env = gymnasium.make(
    "blade/BLADE-v0",
    game=game,
    observation_space=observation_space,
    action_space=action_space,
    action_transform_fnc=action_transform_fnc,
    observation_filter_fnc=observation_filter_fnc,
    reward_filter_fnc=reward_filter_fnc,
    termination_filter_fnc=termination_filter_fnc,
)

model = PPO(
    "MlpPolicy",
    env,
    verbose=1,
    device="cpu",
    learning_rate=3e-4,
    # clip_range=0.2,
    n_steps=512,
    batch_size=32,
    # gamma=0.95,
    # gae_lambda=0.9,
    # ent_coef=0.01,
    # vf_coef=0.5,
    # max_grad_norm=0.5,
)

if True:
    model.learn(total_timesteps=35_000 * 10)
    model.save("default_hyper_ppo_aircraft.zip")

# model0 = PPO.load("muh_model.zip", device="cpu")
# model1 = PPO.load("ppo_aircraft.zip", device="cpu")
model2 = PPO.load("default_hyper_ppo_aircraft.zip", device="cpu")

# mean, std = evaluate_agent(model0, env)
# print(f"mean: {mean} std: {std}")

# mean, std = evaluate_agent(model1, env)
# print(f"mean: {mean} std: {std}")

mean, std = evaluate_agent(model2, env)
print(f"mean: {mean} std: {std}")


"""
for filename in os.listdir(demo_folder):
    if filename.endswith(".json") and "scen_t" in filename:
        os.remove(f"{demo_folder}/{filename}")

vec_env = model.get_env()
obs = vec_env.reset()

steps = 35000
for step in range(steps):
    action, _states = model.predict(obs, deterministic=True)
    obs, reward, done, info = vec_env.step(action)
    if step == 10000:
        env.unwrapped.export_scenario(f"{demo_folder}/scen_t{step}.json")
    elif step == 20000:
        env.unwrapped.export_scenario(f"{demo_folder}/scen_t{step}.json")
    elif step == 30000:
        env.unwrapped.export_scenario(f"{demo_folder}/scen_t{step}.json")

env.unwrapped.export_scenario(f"{demo_folder}/scen_t{steps}.json") # target location is (4.5, 5.5)
"""
