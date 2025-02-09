#pragma once

#include "core/Coordinates.h"
#include "Unit.h"
#include <vector>
#include <string>

struct MovableUnitParameters : public UnitParameters
{
    double heading = 0.0;
    double speed = 0.0; // KTS
    double currentFuel = 0.0;
    double maxFuel = 0.0;
    double fuelRate = 0.0; // lbs/hr
    double range = 0.0;    // NM
    std::vector<Coordinates> route;
};

class MovableUnit : public Unit
{
public:
    explicit MovableUnit(const MovableUnitParameters &params);

    virtual ~MovableUnit() = default;

    double getHeading() const { return m_heading; }
    double getSpeed() const { return m_speed; }
    double getCurrentFuel() const { return m_currentFuel; }
    double getMaxFuel() const { return m_maxFuel; }
    double getFuelRate() const { return m_fuelRate; }
    double getRange() const { return m_range; }
    const std::vector<Coordinates> &getRoute() const { return m_route; }

    void update(double dt) override;

private:
    double m_heading;
    double m_speed;
    double m_currentFuel;
    double m_maxFuel;
    double m_fuelRate;
    double m_range;
    std::vector<Coordinates> m_route;
};
