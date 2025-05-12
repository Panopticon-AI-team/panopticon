# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import os
import sys

sys.path.insert(0, os.path.abspath("../gym"))

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "panopticon"
copyright = "2025, Panopticon AI"
author = "Luke"
release = "0.1"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

# -- General configuration
extensions = ["sphinx.ext.napoleon"]

templates_path = ["_templates"]
exclude_patterns = []

# override the sidebar — remove about.html, use only templates Classic provides
html_sidebars = {
    "**": [
        "globaltoc.html",  # full, always-visible TOC
        "searchbox.html",  # search field
    ]
}

# options specific to alabaster
html_theme_options = {
    # always include hidden docs (so your multiple toctree blocks show up)
    "globaltoc_includehidden": True,
    # do not collapse branches by default
    "globaltoc_collapse": False,
    # how many levels of headings to show under each caption
    "globaltoc_maxdepth": 2,
    "stickysidebar": True,
    "bgcolor": "#def3ff",  # page background
    "sidebarbgcolor": "#bae7ff",  # sidebar background
    "relbarbgcolor": "#000000",  # relation-bar background
    "footerbgcolor": "#0a0652",  # footer background
    "sidebartextcolor": "#000000",
    "sidebarlinkcolor": "#55636b",
}

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "classic"

html_static_path = ["_static"]
