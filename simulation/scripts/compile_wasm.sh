# set path for export
EXPORT_PATH="../client/emscripten_dist/simulation.js"
MODULE_NAME="Simulation"
# list cpp files to link
CPP_FILES="src/core/Scenario.cpp src/units/Airbase.cpp src/units/Aircraft.cpp src/units/MovableUnit.cpp src/utils/GeoUtils.cpp src/utils/MathUtils.cpp"
# compile wasm
emcc --bind bindings/wasm/Embind.cpp $CPP_FILES -I./src -o $EXPORT_PATH -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME=$MODULE_NAME --emit-tsd simulation.d.ts