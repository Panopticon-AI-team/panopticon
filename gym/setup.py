from setuptools import setup

description = """BLADE"""

setup(
    name="BLADE",
    version="1.0.0",
    description="Revolutionizing the art of war.",
    long_description=description,
    author="Minh Hua",
    author_email="mhua2@jh.edu",
    license="Apache 2.0 License",
    keywords="Warfare Simulation AI Reinforcement Learning",
    url="https://github.com/orgulous/panopticon",
    packages=[
        "blade",
        "blade.db",
        "blade.engine",
        "blade.mission",
        "blade.units",
        "blade.utils",
        "blade.envs",
    ],
    install_requires=["shapely==2.0.6"],
    extras_require={"gym": ["gymnasium==0.29.1", "stable-baselines3==2.4.1"]},
)
