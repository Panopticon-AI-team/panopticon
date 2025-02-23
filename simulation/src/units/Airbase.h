#pragma once

#include "Aircraft.h"
#include "Unit.h"
#include <string>
#include <map>

struct AirbaseParameters : public UnitParameters
{
    std::map<std::string, int> basedAircraft;
};

class Airbase : public Unit
{
public:
    Airbase(const AirbaseParameters &params);

    virtual ~Airbase() = default;

    const std::map<std::string, int> &getBasedAircraft() const { return m_basedAircraft; }

    void setBasedAircraft(const std::map<std::string, int> &basedAircraft);
    void addBasedAircraft(const std::string &aircraftId, int count);
    void removeBasedAircraft(const std::string &aircraftId, int count);

    void update(double dt) override {}

private:
    std::map<std::string, int> m_basedAircraft;
};
