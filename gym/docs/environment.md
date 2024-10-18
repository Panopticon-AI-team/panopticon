## See [GitBook](https://docs.panopticon-ai.com/) for more detailed docs

## Environment Table of Contents

- [BLADE](#blade)
  - [What is BLADE](#what-is-blade)
- [RL Environment](#rl-environment)
- [Actions and Observations](#actions-and-observations)
  - [Observation](#observations)
  - [Actions](#actions)

<!-- /TOC -->

## BLADE

### What is BLADE

Battlefield Learning Assessment and Decision-making Environment (BLADE) is a warfare simulation with an OpenAI Gymnasium implementation. BLADE is the engine that powers the [panopticon-ai webapp](https://app.panopticon-ai.com/).

## RL Environment

Refer to the [README](https://github.com/Panopticon-AI-team/panopticon/blob/main/gym/README.md) for instructions on how to install the Gymnasium environment. Refer to [demo.py](https://github.com/Panopticon-AI-team/panopticon/blob/main/gym/scripts/demo.py) for example usage. To initialize a BLADE environment, the user must provide a scenario JSON file that defines the initial setup of the scenario. The easiest way to obtain this file is to use the [panopticon-ai webapp](https://app.panopticon-ai.com/) to build a scenario and then exporting it to JSON format. Then, the BLADE environment can be run like any other Gymnasium environment. Observations at each timestep can be printed to the console using the environment's `pretty_print` function, and the entire scenario at a timestep can also be exported using `export_scenario`. The exported scenario can then be uploaded to the [panopticon-ai webapp](https://app.panopticon-ai.com/) for visualization.

## Actions and Observations

Given the complex nature of any warfare scenario, the base representations of the state and action spaces rely on Gymnasium's [Text space](https://gymnasium.farama.org/api/spaces/fundamental/#gymnasium.spaces.Text). Users interested in modifying these spaces to fit their scenario should refer to the environment definition at [blade.py](https://github.com/Panopticon-AI-team/panopticon/blob/main/gym/blade/envs/blade.py).

### Observations

BLADE's state space is defined by the [Scenario](https://github.com/Panopticon-AI-team/panopticon/blob/main/gym/blade/Scenario.py) class. This class contains parameters like the scenario's name, start time, duration, sides, current time, simulation speed (called time compression), aircraft, ships, facilities, airbases, weapons, reference points, and missions. Each of the objects starting from aircraft also have corresponding class definitions that define their attributes (reference [units](https://github.com/Panopticon-AI-team/panopticon/tree/main/gym/blade/units)).

### Actions

BLADE's action space is defined by the functions provided by the [Game](https://github.com/Panopticon-AI-team/panopticon/blob/main/gym/blade/Game.py) class that modifies the underlying simulation. The list of functions are:

```
remove_aircraft(aircraft_id) // remove an aircraft from the scenario
land_aircraft(aircraft_id) // command the aircraft to land at its homebase, or if it does not have a homebase, land at the nearest base
```

More will be added TBD
