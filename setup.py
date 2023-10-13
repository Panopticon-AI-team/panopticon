from setuptools import setup

description = """panopticon"""

setup(
    name='panopticon',
    version='0.1.0',
    description='Simulates theater-level military operations for wargames and suggests dominant warfighting strategies to commanders',
    long_description=description,
    author='Minh Hua',
    author_email='minhhua12345@gmail.com',
    license='MIT License',
    keywords='panopticon-ai reinforcement learning',
    url='https://github.com/orgulous/panopticon',
    packages=[
        'panopticon.agents',
        'panopticon.agents.utilities',
        'panopticon.environments',
        'panopticon.environments.panopticon_env',
        'panopticon.environments.utilities',        
        'panopticon.tests',
        'panopticon.tests.utilities',        
        'panopticon.training',
        'panopticon.training.utilities',        
    ],
)