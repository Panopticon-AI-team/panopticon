"""
config test file.
This is not used anymore
"""

import json

try:
    with open("config.json", "r") as file:
        config = json.load(file)

    base_ls = config["bases"]
    for base in base_ls:
        name = base["base_name"]
        print(name)

        unit_ls = base["units"]
        for unit in unit_ls:
            unit_id = unit["unit_id"]
            print(unit_id)

            munition_ls = unit["munitions"]
            for munition in munition_ls:
                print(munition["munition_id"])

except FileNotFoundError:
    print("Error: The config.json file was not found.")
except json.JSONDecodeError:
    print("Error: The config file is not in proper JSON format.")
