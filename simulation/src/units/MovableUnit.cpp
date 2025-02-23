#include "MovableUnit.h"
#include "core/Coordinates.h"
#include "utils/GeoUtils.h"
#include "utils/Constants.h"
#include <iostream>
#include <array>

MovableUnit::MovableUnit(const MovableUnitParameters &params)
    : Unit(params),
      m_heading(params.heading), m_speedKnots(params.speedKnots), m_currentFuelLbs(params.currentFuelLbs), m_maxFuelLbs(params.maxFuelLbs), m_fuelRateLbsPerHour(params.fuelRateLbsPerHour)
{
}

void MovableUnit::update(double dt)
{
    if (!m_route.empty())
    {
        const Coordinates &nextWaypoint = m_route.front();
        const double nextWaypointLatitude = nextWaypoint.getLatitude();
        const double nextWaypointLongitude = nextWaypoint.getLongitude();

        const Coordinates &currentCoordinates = getCoordinates();
        const double currentLatitude = currentCoordinates.getLatitude();
        const double currentLongitude = currentCoordinates.getLongitude();

        const double distanceToWaypoint = simulation_utils::getDistanceKmBetweenTwoPoints(
            currentLatitude, currentLongitude,
            nextWaypointLatitude, nextWaypointLongitude);

        if (distanceToWaypoint < 0.01) // if distance between current and next waypoint is less than 10 meters
        {
            setLatitude(nextWaypointLatitude);
            setLongitude(nextWaypointLongitude);
            m_route.erase(m_route.begin());
        }
        else
        {
            // Move toward the next waypoint, based on speed & deltaTime
            // If speed is in knots, distance traveled in 'deltaTime' seconds is:
            //   traveledDistance = m_speedKnots * (deltaTime / 3600.0)
            const double traveledDistance = m_speedKnots * (dt / simulation_utils::SECONDS_PER_HOUR);

            // getNextCoordinates is a helper that returns the next lat/lon
            // after moving 'traveledDistance' toward the target.
            std::array<double, 2> nextCoordinates = simulation_utils::getNextCoordinates(
                currentLatitude,
                currentLongitude,
                nextWaypointLatitude,
                nextWaypointLongitude,
                traveledDistance);

            setLatitude(nextCoordinates[0]);
            setLongitude(nextCoordinates[1]);

            // Update heading based on current position -> next waypoint
            m_heading = simulation_utils::getBearingDegreesBetweenTwoPoints(
                nextCoordinates[0],
                nextCoordinates[1],
                nextWaypointLatitude,
                nextWaypointLongitude);
        }

        // Decrease fuel based on fuel rate, scaled by real time
        // If fuelRate is lbs/hr, then in deltaTime (s):
        // fuelUsed = (fuelRate / 3600) * deltaTime
        double fuelUsed = (m_fuelRateLbsPerHour / simulation_utils::SECONDS_PER_HOUR) * dt;
        m_currentFuelLbs -= fuelUsed;
        if (m_currentFuelLbs <= 0.0)
        {
            // If out of fuel, remove the aircraft from the scenario
            // remove();
        }
    }
}
