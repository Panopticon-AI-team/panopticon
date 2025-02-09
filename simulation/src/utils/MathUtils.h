#pragma once

namespace simulation_utils
{
    double toRadians(double degrees);
    double toDegrees(double radians);
    double randomFloat(double min = 0.0, double max = 1.0);
    int randomInt(int min = 0, int max = 100);
} // namespace simulation_utils
