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
        'panopticon',
        'panopticon.agents',
        'panopticon.environments',
        'panopticon.environments.panopticon_env',     
        'panopticon.tests',
        'panopticon.training',
        'panopticon.utilities'    
    ],
    install_requires=[
        'Pillow',
    ],
)