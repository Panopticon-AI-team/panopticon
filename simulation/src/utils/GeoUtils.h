#pragma once

#include <string>
#include <vector>
#include <array>

namespace simulation_utils
{
    /**
     * Returns the bearing from (startLatitude, startLongitude) to (destLatitude, destLongitude),
     * in degrees [0, 360).
     */
    double getBearingBetweenTwoPoints(double startLatitude, double startLongitude,
                                      double destLatitude, double destLongitude);
    /**
     * Returns distance (in kilometers) between two lat/lon points using
     * the haversine formula.
     */
    double getDistanceBetweenTwoPoints(double startLatitude, double startLongitude,
                                       double destLatitude, double destLongitude);
    /**
     * Returns the terminal lat/lon (in degrees) after traveling `distance` (km)
     * from (startLatitude, startLongitude) on a given `bearing` (degrees).
     */
    std::array<double, 2> getTerminalCoordinatesFromDistanceAndBearing(
        double startLatitude, double startLongitude,
        double distanceKm, double bearingDegrees);
    /**
     * Calculates waypoints based on platformSpeed (knots), converting distance to NM for timing.
     * Returns a vector of (lat, lon) pairs.
     */
    std::vector<std::array<double, 2>> generateRouteRealistic(
        double originLat, double originLon,
        double destLatitude, double destLongitude,
        double platformSpeed // in knots
    );
    /**
     * Gets the "next coordinates" after traveling a single step toward
     * (destLatitude, destLongitude) at `platformSpeed` (knots).
     *
     * This is analogous to getNextCoordinates in the TS code.
     * Returns a (lat, lon) pair.
     */
    std::array<double, 2> getNextCoordinates(
        double originLat, double originLon,
        double destLatitude, double destLongitude,
        double platformSpeed // knots
    );
} // namespace simulation_utils
