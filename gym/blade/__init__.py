from gymnasium.envs.registration import register

register(
    id="blade/BLADE-v0",
    entry_point="blade.envs:BLADE",
    max_episode_steps=2000,
)