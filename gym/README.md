# Prerequisites
1. Python 3.12.3
2. pip

# Quick Start Guide
## Get BLADE
1. Click on "Clone or download", and then "Download Zip". 
2. Unzip the repo anywhere.
3. Navigate to the folder than contains `setup.py` and install the repository using `pip install .` Anytime you make changes to the files in the project folder, you need to reinstall the package using `pip install .`. Alternatively, use `pip install -e .` to install the package in editable mode. After doing this you can change the code without needing to continue to install it. 
4. [gymnasium](https://gymnasium.farama.org/) is a dependency for users who want to use BLADE as a Gym environment. In this case, use `pip install .[gym]` or `pip install -e .[gym]` for setup.

## Run a demo
1. Run the provided demo in `scripts/demo.py`.
2. The demo will output a scenario file that can be viewed using the frontend GUI.
