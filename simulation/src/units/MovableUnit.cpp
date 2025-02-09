#include "MovableUnit.h"
#include "core/Coordinates.h"
#include "utils/GeoUtils.h"
#include <iostream>
#include <array>

MovableUnit::MovableUnit(const MovableUnitParameters &params)
    : Unit(params),
      m_heading(params.heading), m_speed(params.speed), m_currentFuel(params.currentFuel), m_maxFuel(params.maxFuel), m_fuelRate(params.fuelRate), m_range(params.range), m_route(params.route)
{
}

void MovableUnit::update(double dt)
{
    if (!m_route.empty())
    {
        const Coordinates &nextWaypoint = m_route.front();
        double nextWaypointLatitude = nextWaypoint.getLatitude();
        double nextWaypointLongitude = nextWaypoint.getLongitude();

        const Coordinates &currentCoordinates = getCoordinates();
        const double currentLatitude = currentCoordinates.getLatitude();
        const double currentLongitude = currentCoordinates.getLongitude();

        double distanceToWaypoint = simulation_utils::getDistanceBetweenTwoPoints(
            currentLatitude, currentLongitude,
            nextWaypointLatitude, nextWaypointLongitude);

        if (distanceToWaypoint < 0.5)
        {
            setLatitude(nextWaypointLatitude);
            setLongitude(nextWaypointLongitude);
            m_route.erase(m_route.begin());
        }
        else
        {
            // Move toward the next waypoint, based on speed & deltaTime
            // If speed is in knots, distance traveled in 'deltaTime' seconds is:
            //   traveledDistance = m_speed * (deltaTime / 3600.0)
            double traveledDistance = m_speed * (dt / 3600.0);

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
            m_heading = simulation_utils::getBearingBetweenTwoPoints(
                nextCoordinates[0],
                nextCoordinates[1],
                nextWaypointLatitude,
                nextWaypointLongitude);
        }

        // Decrease fuel based on fuel rate, scaled by real time
        // If fuelRate is lbs/hr, then in deltaTime (s):
        // fuelUsed = (fuelRate / 3600) * deltaTime
        double fuelUsed = (m_fuelRate / 3600.0) * dt;
        m_currentFuel -= fuelUsed;
        if (m_currentFuel <= 0.0)
        {
            // If out of fuel, remove the aircraft from the scenario
            // remove();
        }
    }
}
