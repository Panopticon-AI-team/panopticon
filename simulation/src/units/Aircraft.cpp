#include "Aircraft.h"
#include "utils/GeoUtils.h"

Aircraft::Aircraft(const AircraftParameters &params)
    : MovableUnit(params),
      m_homeBaseId(params.homeBaseId), m_rtb(params.rtb), m_targetId(params.targetId)
{
}

bool Aircraft::handleRtb()
{
  // If the aircraft is returning to base (RTB)
  if (m_rtb)
  {
    // Base *aircraftHomeBase = nullptr;

    // if (!m_homeBaseId.empty())
    // {
    //   aircraftHomeBase = Scenario::getInstance().getBaseById(m_homeBaseId);
    // }
    // if (!aircraftHomeBase)
    // {
    //   aircraftHomeBase = Scenario::getInstance().getClosestBaseToAircraft(this);
    // }

    // if (aircraftHomeBase != nullptr)
    // {
    //   const Coordinates &currentCoordinates = getCoordinates();
    //   const double currentLatitude = currentCoordinates.getLatitude();
    //   const double currentLongitude = currentCoordinates.getLongitude();
    //   double distanceToBase = simulation_utils::getDistanceBetweenTwoPoints(
    //       currentLatitude,
    //       currentLongitude,
    //       aircraftHomeBase->getLatitude(),
    //       aircraftHomeBase->getLongitude());

    //   if (distanceToBase < 0.5)
    //   {
    //     // land();
    //     return true; // Stop further updates this frame
    //   }
    // }
  }
  return false;
}

void Aircraft::update(double dt)
{
  const bool currentlyRtb = handleRtb();
  if (currentlyRtb)
  {
    return;
  }
  else
  {
    MovableUnit::update(dt);
  }
}