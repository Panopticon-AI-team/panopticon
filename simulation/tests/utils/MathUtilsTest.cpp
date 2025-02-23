// #include "MathUtils.h"
// #include <algorithm> // std::clamp
// #include <random>

// namespace simulation_utils
// {

//     double toRadians(double degrees)
//     {
//         return (degrees * M_PI) / 180.0;
//     }

//     double toDegrees(double radians)
//     {
//         return (radians * 180.0) / M_PI;
//     }

//     double randomFloat(double min, double max)
//     {
//         static thread_local std::mt19937 gen(std::random_device{}());
//         std::uniform_real_distribution<double> dist(min, max);
//         return dist(gen);
//     }

//     int randomInt(int min, int max)
//     {
//         static thread_local std::mt19937 gen(std::random_device{}());
//         std::uniform_int_distribution<int> dist(min, max);
//         return dist(gen);
//     }

// } // namespace simulation_utils
