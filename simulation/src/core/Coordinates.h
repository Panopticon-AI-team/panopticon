#pragma once

#include <stdexcept>

class Coordinates
{
public:
    Coordinates() : m_latitude(0.0), m_longitude(0.0), m_altitude(0.0) {}
    Coordinates(double latitude, double longitude, double altitude)
        : m_latitude(latitude), m_longitude(longitude), m_altitude(altitude) {}

    double getLatitude() const { return m_latitude; }
    double getLongitude() const { return m_longitude; }
    double getAltitude() const { return m_altitude; }

    void setLatitude(double latitude)
    {
        if (latitude < -90.0 || latitude > 90.0)
        {
            throw std::invalid_argument("Latitude must be between -90 and 90 degrees");
        }
        m_latitude = latitude;
    }
    void setLongitude(double longitude)
    {
        if (longitude < -180.0 || longitude > 180.0)
        {
            throw std::invalid_argument("Longitude must be between -180 and 180 degrees");
        }
        m_longitude = longitude;
    }
    void setAltitude(double altitude) { m_altitude = altitude; }

private:
    double m_latitude;
    double m_longitude;
    double m_altitude;
};
