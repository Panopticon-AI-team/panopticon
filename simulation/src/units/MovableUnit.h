#pragma once

#include "core/Coordinates.h"
#include "Unit.h"
#include <vector>
#include <string>

struct MovableUnitParameters : public UnitParameters
{
    double heading = 0.0;
    double speedKnots = 0.0; // KTS
    double currentFuelLbs = 0.0;
    double maxFuelLbs = 0.0;
    double fuelRateLbsPerHour = 0.0; // lbs/hr
};

class MovableUnit : public Unit
{
public:
    explicit MovableUnit(const MovableUnitParameters &params);

    virtual ~MovableUnit() = default;

    double getHeading() const { return m_heading; }
    double getSpeedKnots() const { return m_speedKnots; }
    double getCurrentFuelLbs() const { return m_currentFuelLbs; }
    double getMaxFuelLbs() const { return m_maxFuelLbs; }
    double getFuelRateLbsPerHour() const { return m_fuelRateLbsPerHour; }
    const std::vector<Coordinates> &getRoute() const { return m_route; }

    void setHeading(double heading) { m_heading = heading; }
    void setSpeedKnots(double speedKnots) { m_speedKnots = speedKnots; }
    void setCurrentFuelLbs(double currentFuelLbs) { m_currentFuelLbs = currentFuelLbs; }
    void setMaxFuelLbs(double maxFuelLbs) { m_maxFuelLbs = maxFuelLbs; }
    void setFuelRateLbsPerHour(double fuelRateLbsPerHour) { m_fuelRateLbsPerHour = fuelRateLbsPerHour; }
    void setRoute(const std::vector<Coordinates> &route) { m_route = route; }

    void addPointToRoute(double latitude, double longitude, double altitude);
    void clearFirstNPointsFromRoute(int count);
    void clearLastNPointsFromRoute(int count);
    void clearRoute();

    void update(double dt) override;

private:
    double m_heading;
    double m_speedKnots;
    double m_currentFuelLbs;
    double m_maxFuelLbs;
    double m_fuelRateLbsPerHour;
    std::vector<Coordinates> m_route;
};
