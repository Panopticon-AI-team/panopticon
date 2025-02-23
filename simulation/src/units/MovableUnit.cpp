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

void MovableUnit::addPointToRoute(
    double latitude, double longitude, double altitude)
{
    m_route.emplace_back(latitude, longitude, altitude);
}

void MovableUnit::clearFirstNPointsFromRoute(int count)
{
    if (count > 0 && count <= m_route.size())
    {
        m_route.erase(m_route.begin(), m_route.begin() + count);
    }
}

void MovableUnit::clearLastNPointsFromRoute(int count)
{
    if (count > 0 && count <= m_route.size())
    {
        m_route.erase(m_route.end() - count, m_route.end());
    }
}

void MovableUnit::clearRoute()
{
    m_route.clear();
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
            //   traveledDistanceNm = m_speedKnots * (deltaTime / 3600.0)
            // const double traveledDistanceNm = m_speedKnots * (dt / simulation_utils::SECONDS_PER_HOUR);
            // const double traveledDistanceKm = traveledDistanceNm * (simulation_utils::NAUTICAL_MILES_TO_METERS / 1000.0);

            // getNextCoordinates is a helper that returns the next lat/lon
            // after moving 'traveledDistanceKm' toward the target.
            std::array<double, 2> nextCoordinates = simulation_utils::getNextCoordinates(
                currentLatitude,
                currentLongitude,
                nextWaypointLatitude,
                nextWaypointLongitude,
                m_speedKnots);

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
