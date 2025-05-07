Code structure
==============

This page describes the organization of the Panopticon source code.

Top-level layout
----------------

This is a test

::  

    panopticon/
    ├── docs/                   Documentation source files
    ├── panopticon/             Core package
    │   ├── __init__.py
    │   ├── simulation.py
    │   ├── map.py
    │   └── utils.py
    ├── examples/               Example scripts
    │   └── basic_example.py
    ├── tests/                  Unit tests
    │   └── test_simulation.py
    └── setup.py

panopticon package
------------------

- **simulation.py**  
  Contains the Simulation class, its configuration and main loop.

- **map.py**  
  Implements map loading, tile definitions and spatial queries.

- **utils.py**  
  Helper functions used by both core classes and examples.

Examples folder
---------------

Each script under **examples/** demonstrates how to use one or more features:

- **basic_example.py** shows a minimal end-to-end run.
- **visual_example.py** (if added) would show how to render output.

Tests folder
------------

Unit tests live under **tests/**. They use pytest and cover key behaviors in simulation and map modules.
