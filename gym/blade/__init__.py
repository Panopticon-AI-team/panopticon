from gymnasium.envs.registration import register

register(
    id="blade/BLADE-v0",
    entry_point="blade.envs:BLADE",
    max_episode_steps=2000,
)

register(
    id="blade/SIMPLE-BLADE-v0",
    entry_point="blade.envs:SIMPLE_BLADE",
    max_episode_steps=100000,
)