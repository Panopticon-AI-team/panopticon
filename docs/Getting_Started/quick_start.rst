
Contributor Start Guide
=======================

Contribution Terms
------------------

By contributing to this project, you agree that your contributions will be licensed under the Apache License, Version 2.0.
You acknowledge that you will not receive payment or compensation for your contributions.

Prerequisites
-------------

- Python 3.12.3
- pip


Get BLADE
------------------




- Click on "Clone or download", and then "Download Zip".
- Unzip the repo anywhere.
- Navigate to the folder that contains ``setup.py`` and install the repository using::

    pip install .

  Anytime you make changes to the files in the project folder, you need to reinstall the package using::

    pip install .

  Alternatively, use::

    pip install -e .

  to install the package in editable mode. After doing this you can change the code without needing to continue to install it.

- ``gymnasium`` is a dependency for users who want to use BLADE as a Gym environment. In this case, use::

    pip install .[gym]

  or::

    pip install -e .[gym]

Run a Demo
----------

- Run the provided demo in ``scripts/simple_demo/demo.py``.
- The demo will output a scenario file that can be viewed using the frontend GUI.
