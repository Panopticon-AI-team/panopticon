#include "GeoUtils.h"
#include "Constants.h"
#include "MathUtils.h"
#include <cmath>

namespace simulation_utils
{
    double getBearingDegreesBetweenTwoPoints(double originLatitude, double originLongitude,
                                             double destinationLatitude, double destinationLongitude)
    {
        double lat1 = toRadians(originLatitude);
        double lon1 = toRadians(originLongitude);
        double lat2 = toRadians(destinationLatitude);
        double lon2 = toRadians(destinationLongitude);

        double y = std::sin(lon2 - lon1) * std::cos(lat2);
        double x = std::cos(lat1) * std::sin(lat2) - std::sin(lat1) * std::cos(lat2) * std::cos(lon2 - lon1);

        double bearing = std::atan2(y, x);
        bearing = toDegrees(bearing);
        bearing = std::fmod((bearing + 360.0), 360.0);

        return bearing;
    }

    double getDistanceKmBetweenTwoPoints(double originLatitude, double originLongitude,
                                         double destinationLatitude, double destinationLongitude)
    {
        double φ1 = toRadians(originLatitude);
        double φ2 = toRadians(destinationLatitude);
        double dLat = toRadians(destinationLatitude - originLatitude);
        double dLon = toRadians(destinationLongitude - originLongitude);

        double a = std::sin(dLat / 2) * std::sin(dLat / 2) +
                   std::cos(φ1) * std::cos(φ2) *
                       std::sin(dLon / 2) * std::sin(dLon / 2);
        double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));
        double dKm = EARTH_RADIUS_KM * c; // distance in kilometers

        return dKm;
    }

    std::array<double, 2> getTerminalCoordinatesFromDistanceAndBearing(
        double originLatitude, double originLongitude,
        double distanceKm, double bearingDeg)
    {
        double brng = toRadians(bearingDeg);
        double lat1 = toRadians(originLatitude);
        double lon1 = toRadians(originLongitude);

        double distRatio = distanceKm / EARTH_RADIUS_KM;

        double lat2 = std::asin(std::sin(lat1) * std::cos(distRatio) + std::cos(lat1) * std::sin(distRatio) * std::cos(brng));
        double lon2 = lon1 + std::atan2(
                                 std::sin(brng) * std::sin(distRatio) * std::cos(lat1),
                                 std::cos(distRatio) - std::sin(lat1) * std::sin(lat2));

        double finalLat = toDegrees(lat2);
        double finalLon = toDegrees(lon2);

        return {finalLat, finalLon};
    }

    std::vector<std::array<double, 2>> generateRouteRealistic(
        double originLatitude, double originLongitude,
        double destinationLatitude, double destinationLongitude,
        double platformSpeedKnots // knots
    )
    {
        std::vector<std::array<double, 2>> route;

        double heading = getBearingDegreesBetweenTwoPoints(originLatitude, originLongitude, destinationLatitude, destinationLongitude);
        double totalDistanceKm = getDistanceKmBetweenTwoPoints(originLatitude, originLongitude, destinationLatitude, destinationLongitude);

        // Convert totalDistance from KM to NM, then divide by speed (knots) to get hours
        double totalDistanceNm = totalDistanceKm * (1000 / NAUTICAL_MILES_TO_METERS);
        double totalTimeHours = totalDistanceNm / platformSpeedKnots;
        int totalTimeSeconds = static_cast<int>(std::floor(totalTimeHours * 3600.0));

        if (totalTimeSeconds <= 0)
        {
            // Means we're extremely close or speed is 0 => just push destination
            route.push_back({destinationLatitude, destinationLongitude});
            return route;
        }

        double legDistanceKm = totalDistanceKm / totalTimeSeconds;

        std::array<double, 2> firstWp = getTerminalCoordinatesFromDistanceAndBearing(
            originLatitude, originLongitude, legDistanceKm, heading);
        route.push_back(firstWp);

        for (int i = 1; i < totalTimeSeconds; ++i)
        {
            std::array<double, 2> newWp = getTerminalCoordinatesFromDistanceAndBearing(
                route[i - 1][0], route[i - 1][1], legDistanceKm, heading);
            route.push_back(newWp);
        }

        route.push_back({destinationLatitude, destinationLongitude});
        return route;
    }

    std::array<double, 2> getNextCoordinates(
        double originLatitude, double originLongitude,
        double destinationLatitude, double destinationLongitude,
        double platformSpeedKnots // knots
    )
    {
        double heading = getBearingDegreesBetweenTwoPoints(originLatitude, originLongitude, destinationLatitude, destinationLongitude);
        double totalDistanceKm = getDistanceKmBetweenTwoPoints(originLatitude, originLongitude, destinationLatitude, destinationLongitude);

        // convert distance to NM, then time in hours
        double totalDistanceNm = totalDistanceKm * (1000 / NAUTICAL_MILES_TO_METERS);
        double speedAbs = (platformSpeedKnots < 0.0) ? -platformSpeedKnots : platformSpeedKnots;
        double totalTimeHours = (speedAbs > 0.0) ? (totalDistanceNm / speedAbs) : 0.0;
        int totalTimeSeconds = static_cast<int>(std::floor(totalTimeHours * 3600.0));

        // If totalTimeSeconds is 0, we can basically "snap" to the dest or do no movement.
        if (totalTimeSeconds <= 0)
        {
            // If we have no time, either we're extremely close or speed is zero
            return {destinationLatitude, destinationLongitude};
        }

        double legDistanceKm = totalDistanceKm / totalTimeSeconds;

        return getTerminalCoordinatesFromDistanceAndBearing(
            originLatitude, originLongitude, legDistanceKm, heading);
    }

} // namespace simulation_utils
