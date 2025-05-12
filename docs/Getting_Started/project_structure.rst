BLADE Project Structure
=======================

The project is divided into two directories: ``client`` and ``gym``.

- ``client`` contains the source code for the web application.
- ``gym`` contains the source code for the Gymnasium environment.

As of this writing, both ``client`` and ``gym`` have their separate copy of the simulation engine:

- Typescript for the web application.
- Python for the Gymnasium environment.

In the future, these two implementations will be integrated.

Simulation Engine
-----------------

- Web application engine: ``client/src/game``
- Gymnasium environment engine: ``gym/blade``

Web Application Technologies
----------------------------

We use React and OpenLayers for the web application. Key folders in the web application source code:

- ``game``: the simulation engine (``gym`` also has a Python version).
- ``gui``: code for the map, toolbar, and other front-end functions.
- ``scenarios``: contains example scenario files in JSON format.
- ``styles``: contains styling for the web application.
- ``tests``: contains tests.
- ``utils``: contains helper functions and constants.

GUI Folder Structure
--------------------

- ``assets``: SVG icon files used on the map.
- ``map``: code for the map and toolbar.
- ``contextProviders``: providers for mouse position, current scenario time, and simulation status.
- ``featureCards``: components for popups (Cards) for selected map features.
- ``mapLayers``: map layers including base maps and feature layers (aircraft, ship, routes, range rings, labels, etc.).
- ``missionEditor``: mission creation and editing menus.
- ``toolbar``: code for the toolbar.
- ``FeaturePopup.tsx``: base component for map feature popups.
- ``MultipleFeatureSelector.tsx``: handles selection of multiple features.
- ``ScenarioMap.tsx``: renders the map, layers, and toolbar.
- ``styles``: styling for the map.

Engine Project Structure
------------------------

- ``db``: "database" with real/notional data for units (aircraft, bases, SAMs, etc.).
- ``engine``: core simulation logic (e.g. weapon engagement).
- ``envs`` (only in ``gym``): Gymnasium environment definitions.
- ``mission``: mission logic.
- ``scenarios`` (only in ``gym``): example scenarios in JSON.
- ``units``: unit classes (e.g. aircraft, ships, bases).
- ``utils`` (only in ``gym``): helper functions and constants.
- ``Game.*``: main simulation class.
- ``Scenario.*``: class for scenarios.
- ``Side.*``: class for scenario sides.