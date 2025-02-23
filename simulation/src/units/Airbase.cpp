#include "Airbase.h"

Airbase::Airbase(const AirbaseParameters &params)
    : Unit(params), m_basedAircraft(params.basedAircraft) {}

void Airbase::setBasedAircraft(const std::map<std::string, int> &basedAircraft) { m_basedAircraft = basedAircraft; }
void Airbase::addBasedAircraft(const std::string &aircraftId, int count) { m_basedAircraft[aircraftId] += count; }
void Airbase::removeBasedAircraft(const std::string &aircraftId, int count) { m_basedAircraft[aircraftId] -= count; }
