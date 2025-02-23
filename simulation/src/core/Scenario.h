#pragma once

#include <string>
#include <vector>

#include "Side.h"
#include <units/Airbase.h>
#include <units/Aircraft.h>

struct ScenarioParameters
{
    std::string id;
    std::string name;
    double startTime;
    double currentTime;
    double durationSeconds;
    double timeCompression = 1.0;
};

class Scenario
{
public:
    Scenario(const ScenarioParameters &params);
    virtual ~Scenario() = default;

    const std::string &getId() const { return m_id; }
    const std::string &getName() const { return m_name; }
    double getStartTime() const { return m_startTime; }
    double getCurrentTime() const { return m_currentTime; }
    double getDurationSeconds() const { return m_durationSeconds; }
    double getTimeCompression() const { return m_timeCompression; }
    // const std::vector<Side> &getSides() const { return m_sides; }
    // const std::vector<Airbase> &getAirbases() const { return m_airbases; }
    const std::vector<Aircraft> &getAircraft() const { return m_aircraft; }

    void setId(const std::string &id) { m_id = id; }
    void setName(const std::string &name) { m_name = name; }
    void setStartTime(double startTime) { m_startTime = startTime; }
    void setCurrentTime(double currentTime) { m_currentTime = currentTime; }
    void setDurationSeconds(double durationSeconds) { m_durationSeconds = durationSeconds; }
    void setTimeCompression(double timeCompression) { m_timeCompression = timeCompression; }
    // void setSides(const std::vector<Side> &sides) { m_sides = sides; }
    // void setAirbases(const std::vector<Airbase> &airbases) { m_airbases = airbases; }
    void setAircraft(const std::vector<Aircraft> &aircraft) { m_aircraft = aircraft; }

    std::vector<Aircraft>::iterator getAircraftIterator(std::string sideId, const std::string &aircraftId);
    Aircraft *getAircraftByIdAndSideId(std::string sideId, const std::string &aircraftId);
    void addAircraft(const AircraftParameters &params);
    void removeAircraft(std::string sideId, const std::string &aircraftId);

    void update(double dt);

private:
    std::string m_id;
    std::string m_name;
    double m_startTime;
    double m_currentTime;
    double m_durationSeconds;
    double m_timeCompression;
    std::vector<Side> m_sides;
    std::vector<Airbase> m_airbases;
    std::vector<Aircraft> m_aircraft;
};
