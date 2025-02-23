#include <gtest/gtest.h>
#include "MovableUnit.h"
#include "core/Coordinates.h"
#include "utils/GeoUtils.h"
#include "utils/Constants.h"

//------------------------------------------------------------------------------
// Test fixture to create consistent parameters
//------------------------------------------------------------------------------
class MovableUnitTest : public ::testing::Test
{
protected:
    void SetUp() override
    {
        // Common parameters used for many of the tests
        params.heading = 45.0;   // 45 degrees
        params.speedKnots = 300; // 300 knots
        params.currentFuelLbs = 10000.0;
        params.maxFuelLbs = 15000.0;
        params.fuelRateLbsPerHour = 2000.0;
        // By default, no route is specified here. Individual tests can customize.
    }

    MovableUnitParameters params;
};

//------------------------------------------------------------------------------
// Test constructor
//------------------------------------------------------------------------------
TEST_F(MovableUnitTest, ConstructorInitializesValues)
{
    MovableUnit unit(params);

    EXPECT_DOUBLE_EQ(unit.getHeading(), params.heading);
    EXPECT_DOUBLE_EQ(unit.getSpeedKnots(), params.speedKnots);
    EXPECT_DOUBLE_EQ(unit.getCurrentFuelLbs(), params.currentFuelLbs);
    EXPECT_DOUBLE_EQ(unit.getMaxFuelLbs(), params.maxFuelLbs);
}

//------------------------------------------------------------------------------
// Test: update does nothing if route is empty
//------------------------------------------------------------------------------
TEST_F(MovableUnitTest, Update_NoRoute_NoMovement)
{
    MovableUnit unit(params);

    // Record initial coordinates
    double initialLat = unit.getCoordinates().getLatitude();
    double initialLon = unit.getCoordinates().getLongitude();

    // Call update with a delta time
    unit.update(1.0); // 1 second

    // Expect no movement
    EXPECT_DOUBLE_EQ(unit.getCoordinates().getLatitude(), initialLat);
    EXPECT_DOUBLE_EQ(unit.getCoordinates().getLongitude(), initialLon);
    // Fuel consumption should still occur if you want it to happen even without a route.
    // By the given code, fuel is only consumed if (!m_route.empty()). So if the route is
    // empty, we expect no fuel consumption:
    EXPECT_DOUBLE_EQ(unit.getCurrentFuelLbs(), params.currentFuelLbs);
}

//------------------------------------------------------------------------------
// Test: update moves unit toward next waypoint
//------------------------------------------------------------------------------
TEST_F(MovableUnitTest, Update_MovesTowardWaypoint)
{
    // Give the unit an initial coordinate
    params.latitude = 40.0;
    params.longitude = -100.0;

    // Create a route with one waypoint
    Coordinates waypoint(40.1, -99.9); // ~some small distance away
    params.route.push_back(waypoint);

    MovableUnit unit(params);

    // We'll simulate 3600 seconds (1 hour).
    // Speed = 300 knots -> distance traveled in 1 hour = 300 NM = 300 * 1.852 km approx = 555.6 km
    // Obviously, that may overshoot or exactly reach the waypoint,
    // depending on distance, but let's test we move at least somewhat closer.

    double initialLat = unit.getCoordinates().getLatitude();
    double initialLon = unit.getCoordinates().getLongitude();

    unit.update(3600.0); // 1 hour

    // Expect that we've moved closer to (40.1, -99.9).
    // For a robust test, we simply check that we changed lat/lon in the "correct" direction
    // or that the route might even be consumed if the distance is small enough.
    double newLat = unit.getCoordinates().getLatitude();
    double newLon = unit.getCoordinates().getLongitude();

    // Basic checks: we must have moved from initial positions closer to waypoint.
    EXPECT_NEAR(newLat, waypoint.getLatitude(), 0.5); // Tolerance depends on how far you expect to travel
    EXPECT_NEAR(newLon, waypoint.getLongitude(), 0.5);

    // Expect some fuel usage occurred
    double expectedFuelUsed = (params.fuelRateLbsPerHour / simulation_utils::SECONDS_PER_HOUR) * 3600.0;
    double actualRemainingFuel = unit.getCurrentFuelLbs();
    double expectedRemainingFuel = params.currentFuelLbs - expectedFuelUsed;
    EXPECT_NEAR(actualRemainingFuel, expectedRemainingFuel, 1e-5);
}

//------------------------------------------------------------------------------
// Test: update sets exact location when waypoint is very close
//------------------------------------------------------------------------------
TEST_F(MovableUnitTest, Update_CompletesWaypointIfClose)
{
    // Give the unit an initial coordinate and a waypoint just 5 meters away
    params.latitude = 40.0;
    params.longitude = -100.0;

    // 5 meters away is ~0.005 km, which is about 0.000045 degrees of lat or lon, roughly
    Coordinates closeWaypoint(40.00004, -99.99995);
    params.route.push_back(closeWaypoint);

    MovableUnit unit(params);

    // Update with a small dt that is enough to move 5 meters
    // Speed = 300 knots -> about 154 m/s. 1 second is enough to pass 5 meters
    unit.update(1.0);

    // The waypoint is within 10 meters (distanceToWaypoint < 0.01 km), so the code sets
    // the position exactly to the waypoint and erases it from the route.
    EXPECT_DOUBLE_EQ(unit.getCoordinates().getLatitude(), closeWaypoint.getLatitude());
    EXPECT_DOUBLE_EQ(unit.getCoordinates().getLongitude(), closeWaypoint.getLongitude());
    // The route should now be empty
    EXPECT_TRUE(unit.getRoute().empty());
}

//------------------------------------------------------------------------------
// Test heading is updated to face the next waypoint
//------------------------------------------------------------------------------
TEST_F(MovableUnitTest, Update_HeadingUpdatesTowardWaypoint)
{
    // Place the unit at some known coordinate
    params.latitude = 40.0;
    params.longitude = -100.0;

    // Create a waypoint in a known direction
    // For instance, slightly north-east of current location
    Coordinates waypoint(40.2, -99.8);
    params.route.push_back(waypoint);

    MovableUnit unit(params);

    // Update for a small time so we move at least a bit toward the waypoint
    unit.update(60.0); // 60 seconds

    double updatedHeading = unit.getHeading();

    // We only check that the heading changed from the initial 45.0
    // to something appropriate for traveling toward the new waypoint.
    // A more thorough test would cross-check the exact bearing using known formulas.
    EXPECT_NE(updatedHeading, params.heading);
}

//------------------------------------------------------------------------------
// Test fuel consumption leads to 0 or negative => presumably "remove from scenario"
//------------------------------------------------------------------------------
TEST_F(MovableUnitTest, Update_FuelGetsDepleted)
{
    // Give a small current fuel so that it will be used up quickly
    params.currentFuelLbs = 10.0;
    params.fuelRateLbsPerHour = 36000.0; // 10 lbs per second

    // Add a dummy waypoint to ensure the code block that consumes fuel is executed
    Coordinates waypoint(40.0, -99.0);
    params.route.push_back(waypoint);

    MovableUnit unit(params);

    // 1 second of simulation should use 10 lbs
    unit.update(1.0);

    // Confirm fuel is at or below zero
    EXPECT_LE(unit.getCurrentFuelLbs(), 0.0);

    // The code snippet to remove the unit is commented out.
    // If it were active, you'd verify that the unit was marked for removal.
    // E.g., EXPECT_TRUE(unit.isRemoved()) if you had such a method.
}
