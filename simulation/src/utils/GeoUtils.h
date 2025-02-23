#pragma once

#include <string>
#include <vector>
#include <array>

namespace simulation_utils
{
    /**
     * Returns the bearing from (originLatitude, originLongitude) to (destinationLatitude, destinationLongitude),
     * in degrees [0, 360).
     */
    double getBearingDegreesBetweenTwoPoints(double originLatitude, double originLongitude,
                                             double destinationLatitude, double destinationLongitude);
    /**
     * Returns distance (in kilometers) between two lat/lon points using
     * the haversine formula.
     */
    double getDistanceKmBetweenTwoPoints(double originLatitude, double originLongitude,
                                         double destinationLatitude, double destinationLongitude);
    /**
     * Returns the terminal lat/lon (in degrees) after traveling `distance` (km)
     * from (originLatitude, originLongitude) on a given `bearing` (degrees).
     */
    std::array<double, 2> getTerminalCoordinatesFromDistanceAndBearing(
        double originLatitude, double originLongitude,
        double distanceKm, double bearingDegrees);
    /**
     * Calculates waypoints based on platformSpeedKnots (knots), converting distance to NM for timing.
     * Returns a vector of (lat, lon) pairs.
     */
    std::vector<std::array<double, 2>> generateRouteRealistic(
        double originLatitude, double originLongitude,
        double destinationLatitude, double destinationLongitude,
        double platformSpeedKnots // in knots
    );
    /**
     * Gets the "next coordinates" after traveling a single step toward
     * (destinationLatitude, destinationLongitude) at `platformSpeedKnots` (knots).
     *
     * This is analogous to getNextCoordinates in the TS code.
     * Returns a (lat, lon) pair.
     */
    std::array<double, 2> getNextCoordinates(
        double originLatitude, double originLongitude,
        double destinationLatitude, double destinationLongitude,
        double platformSpeedKnots // knots
    );
} // namespace simulation_utils
