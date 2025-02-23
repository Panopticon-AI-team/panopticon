#include <algorithm>

#include "Scenario.h"
#include <units/Aircraft.h>
#include <units/Airbase.h>

Scenario::Scenario(const ScenarioParameters &params)
    : m_id(params.id), m_name(params.name), m_startTime(params.startTime),
      m_currentTime(params.currentTime), m_durationSeconds(params.durationSeconds),
      m_timeCompression(params.timeCompression)
{
}

std::vector<Aircraft>::iterator Scenario::getAircraftIterator(std::string sideId, const std::string &aircraftId)
{
    return std::find_if(m_aircraft.begin(), m_aircraft.end(),
                        [&](const Aircraft &aircraft)
                        { return aircraft.getId() == aircraftId && aircraft.getSideId() == sideId; });
}

Aircraft *Scenario::getAircraftByIdAndSideId(std::string sideId, const std::string &aircraftId)
{
    auto aircraftSearchResult = getAircraftIterator(sideId, aircraftId);
    return (aircraftSearchResult != m_aircraft.end()) ? &(*aircraftSearchResult) : nullptr;
}

void Scenario::addAircraft(const AircraftParameters &params)
{
    m_aircraft.push_back(Aircraft(params));
}

void Scenario::removeAircraft(std::string sideId, const std::string &aircraftId)
{
    auto aircraftSearchResult = getAircraftIterator(sideId, aircraftId);
    if (aircraftSearchResult != m_aircraft.end())
    {
        m_aircraft.erase(aircraftSearchResult);
    }
}

void Scenario::update(double dt)
{
    double stepSize = dt * m_timeCompression;
    m_currentTime += stepSize;
    for (Airbase &airbase : m_airbases)
    {
        airbase.update(stepSize);
    }
    for (Aircraft &aircraft : m_aircraft)
    {
        aircraft.update(stepSize);
    }
}

// Side *Scenario::getSide(const std::string &sideId)
// {
//     auto it = std::find_if(m_sides.begin(), m_sides.end(),
//                            [&](const Side &s)
//                            { return s.getId() == sideId; });
//     return (it != m_sides.end()) ? &(*it) : nullptr;
// }

// Aircraft *Scenario::getAircraft(const std::string &sideId, const std::string &aircraftId)
// {
//     Side *side = getSide(sideId);
//     if (!side)
//         return nullptr;

//     return side->findAircraft(aircraftId);
// }

// Airbase *Scenario::getAirbase(const std::string &sideId, const std::string &airbaseId)
// {
//     Side *side = getSide(sideId);
//     if (!side)
//         return nullptr;

//     return side->findAirbase(airbaseId);
// }