cmake_minimum_required(VERSION 3.16)
project(MySimulation LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Optionally enable building bindings
option(BUILD_PYTHON_BINDINGS "Build Python bindings" OFF)
option(BUILD_WASM_BINDINGS   "Build WASM bindings"   OFF)

# ------------------------------------------------------------------------------
# Gather all C++ source files from src/ for a single library
# If you have multiple libraries/executables, structure this section accordingly.
# ------------------------------------------------------------------------------
file(GLOB_RECURSE SRC_SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cxx"
)

add_library(SimulationLib STATIC ${SRC_SOURCES})

# If you need to link additional libraries or set include paths, do so:
# target_include_directories(SimulationLib PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)
# target_link_libraries(SimulationLib PRIVATE SomeExternalLib)

# ------------------------------------------------------------------------------
# (Optional) Build Python bindings
# ------------------------------------------------------------------------------
if(BUILD_PYTHON_BINDINGS)
    # Example if you have a single .cpp in bindings/python:
    add_library(PythonBinding MODULE bindings/python/PyBind.cpp)
    # Link against your core library if it needs the same symbols:
    target_link_libraries(PythonBinding PRIVATE SimulationLib)
    # Possibly set properties for Python module naming, etc.
endif()

# ------------------------------------------------------------------------------
# (Optional) Build WASM bindings
# ------------------------------------------------------------------------------
if(BUILD_WASM_BINDINGS)
    # Example if you have a single .cpp in bindings/wasm:
    add_library(WasmBinding OBJECT bindings/wasm/Embind.cpp)
    # Link or configure Emscripten specifics here if needed
    # target_link_libraries(WasmBinding PRIVATE SimulationLib)
endif()

# ------------------------------------------------------------------------------
# Add the tests subdirectory
# ------------------------------------------------------------------------------
# By default, we do 'add_subdirectory(tests)' which will look for tests/CMakeLists.txt
# that you wrote previously. That file will:
#   - find & link Google Test
#   - build all .cpp files in tests
#   - run them as a test suite
add_subdirectory(tests)
