cmake_minimum_required(VERSION 3.16)
project(SimulationTests)

# 1. Locate Google Test. 
#    If GTest is not installed system-wide, you can use FetchContent or 
#    add_subdirectory(googletest) if you have it as a submodule.
# GoogleTest requires at least C++14
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/3fbe4db9a39291ae8d7a9c5f1d75896bb4c5a18f.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Optionally enable testing in case it's not enabled higher up.
enable_testing()

# 2. Include the main source directory for headers if necessary:
include_directories(${PROJECT_SOURCE_DIR}/../src)

# 3. Collect all test files from subdirectories
#    Adjust patterns to pick up all your test .cpp files:
file(GLOB TEST_SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/units/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/utils/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/core/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/sensor/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/weapon/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/ai/*.cpp"
)

# 4. Create the test executable (you can name it however you like)
add_executable(RunAllTests ${TEST_SOURCES})

# 5. Link to GTest and any of your libraries needed for the tests.
#    If you have already created a library from your source (e.g., `SimulationLib`)
#    in the top-level CMake, link it here:
target_link_libraries(RunAllTests
    PRIVATE
        GTest::gtest
        GTest::gtest_main
        # e.g. SimulationLib
)

# 6. Register the tests with CTest
add_test(NAME RunAllTests COMMAND RunAllTests)
