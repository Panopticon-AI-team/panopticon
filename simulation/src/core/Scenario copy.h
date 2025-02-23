#pragma once

#include <string>
#include <vector>
// #include <memory>
#include <algorithm> // For std::find_if
// #include <limits>    // For std::numeric_limits<double>

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
    std::vector<Side> sides;
    std::vector<Airbase> airbases;
    std::vector<Aircraft> aircraft;
};

class Scenario
{
public:
    Scenario(const ScenarioParameters &params)
        : m_id(params.id), m_name(params.name), m_startTime(params.startTime),
          m_currentTime(params.currentTime), m_durationSeconds(params.durationSeconds),
          m_timeCompression(params.timeCompression), m_sides(params.sides), m_airbases(params.airbases), m_aircraft(params.aircraft)
    {
    }
    virtual ~Scenario() = default;

    Side *getSide(const std::string &sideId);
    Aircraft *getAircraft(const std::string &sideId, const std::string &aircraftId);
    Airbase *getAirbase(const std::string &sideId, const std::string &airbaseId);

    // // For missions, we use dynamic_cast to check if a mission is Patrol or Strike.
    // // By design, PatrolMission and StrikeMission derive from a common Mission base class.
    // PatrolMission *getPatrolMission(const std::string &missionId)
    // {
    //     for (auto &m : missions)
    //     {
    //         if (m->id == missionId)
    //         {
    //             // Attempt to cast to PatrolMission
    //             if (auto *pm = dynamic_cast<PatrolMission *>(m.get()))
    //             {
    //                 return pm;
    //             }
    //         }
    //     }
    //     return nullptr;
    // }

    // StrikeMission *getStrikeMission(const std::string &missionId)
    // {
    //     for (auto &m : missions)
    //     {
    //         if (m->id == missionId)
    //         {
    //             // Attempt to cast to StrikeMission
    //             if (auto *sm = dynamic_cast<StrikeMission *>(m.get()))
    //             {
    //                 return sm;
    //             }
    //         }
    //     }
    //     return nullptr;
    // }

    // // ------------------------------------------------------------------------
    // // Return all missions of specific types
    // // ------------------------------------------------------------------------
    // std::vector<PatrolMission *> getAllPatrolMissions()
    // {
    //     std::vector<PatrolMission *> result;
    //     for (auto &m : missions)
    //     {
    //         if (auto *pm = dynamic_cast<PatrolMission *>(m.get()))
    //         {
    //             result.push_back(pm);
    //         }
    //     }
    //     return result;
    // }

    // std::vector<StrikeMission *> getAllStrikeMissions()
    // {
    //     std::vector<StrikeMission *> result;
    //     for (auto &m : missions)
    //     {
    //         if (auto *sm = dynamic_cast<StrikeMission *>(m.get()))
    //         {
    //             result.push_back(sm);
    //         }
    //     }
    //     return result;
    // }

    // // ------------------------------------------------------------------------
    // // Update methods (like the TypeScript "updateAircraft", etc.)
    // // ------------------------------------------------------------------------
    // void updateAircraft(const std::string &aircraftId,
    //                     const std::string &aircraftName,
    //                     const std::string &aircraftClassName,
    //                     double aircraftSpeed,
    //                     double aircraftWeaponQuantity,
    //                     double aircraftCurrentFuel,
    //                     double aircraftFuelRate,
    //                     const Weapon &sampleWeapon)
    // {
    //     if (Aircraft *a = getAircraft(aircraftId))
    //     {
    //         a->name = aircraftName;
    //         a->className = aircraftClassName;
    //         a->speed = aircraftSpeed;
    //         if (a->weapons.empty())
    //         {
    //             // If no weapons, add one as sample
    //             a->weapons.push_back(sampleWeapon);
    //         }
    //         else
    //         {
    //             // Update quantity on each existing weapon
    //             for (auto &w : a->weapons)
    //             {
    //                 w.currentQuantity = aircraftWeaponQuantity;
    //             }
    //         }
    //         a->currentFuel = aircraftCurrentFuel;
    //         a->fuelRate = aircraftFuelRate;
    //     }
    // }

    // void updateFacility(const std::string &facilityId,
    //                     const std::string &facilityName,
    //                     const std::string &facilityClassName,
    //                     double facilityRange,
    //                     double facilityWeaponQuantity)
    // {
    //     if (Facility *f = getFacility(facilityId))
    //     {
    //         f->name = facilityName;
    //         f->className = facilityClassName;
    //         f->range = facilityRange;
    //         for (auto &w : f->weapons)
    //         {
    //             w.currentQuantity = facilityWeaponQuantity;
    //         }
    //     }
    // }

    // void updateAirbase(const std::string &airbaseId,
    //                    const std::string &airbaseName)
    // {
    //     if (Airbase *base = getAirbase(airbaseId))
    //     {
    //         base->name = airbaseName;
    //     }
    // }

    // void updateShip(const std::string &shipId,
    //                 const std::string &shipName,
    //                 const std::string &shipClassName,
    //                 double shipSpeed,
    //                 double shipCurrentFuel,
    //                 double shipWeaponQuantity,
    //                 double shipRange)
    // {
    //     if (Ship *s = getShip(shipId))
    //     {
    //         s->name = shipName;
    //         s->className = shipClassName;
    //         s->speed = shipSpeed;
    //         s->currentFuel = shipCurrentFuel;
    //         s->range = shipRange;
    //         for (auto &w : s->weapons)
    //         {
    //             w.currentQuantity = shipWeaponQuantity;
    //         }
    //     }
    // }

    // void updateReferencePoint(const std::string &referencePointId,
    //                           const std::string &referencePointName)
    // {
    //     if (ReferencePoint *r = getReferencePoint(referencePointId))
    //     {
    //         r->name = referencePointName;
    //     }
    // }

    // // ------------------------------------------------------------------------
    // // HomeBase logic: "Airbase | Ship"
    // // ------------------------------------------------------------------------
    // std::optional<HomeBase> getAircraftHomeBase(const std::string &aircraftId)
    // {
    //     if (Aircraft *a = getAircraft(aircraftId))
    //     {
    //         // We assume "homeBaseId" in Aircraft might be either an Airbase or Ship ID
    //         // Try to see if it is an Airbase
    //         if (Airbase *base = getAirbase(a->homeBaseId))
    //         {
    //             return HomeBase(base);
    //         }
    //         // Otherwise see if it's a Ship
    //         if (Ship *s = getShip(a->homeBaseId))
    //         {
    //             return HomeBase(s);
    //         }
    //     }
    //     // If we cannot find any, return empty
    //     return std::nullopt;
    // }

    // std::optional<HomeBase> getClosestBaseToAircraft(const std::string &aircraftId)
    // {
    //     Aircraft *a = getAircraft(aircraftId);
    //     if (!a)
    //         return std::nullopt;

    //     double closestDistance = std::numeric_limits<double>::max();
    //     std::optional<HomeBase> closestBase;

    //     // 1. Check all airbases of the same side
    //     for (auto &base : airbases)
    //     {
    //         if (base.sideName != a->sideName)
    //             continue;

    //         double dist = getDistanceBetweenTwoPoints(
    //             a->latitude, a->longitude, base.latitude, base.longitude);
    //         if (dist < closestDistance)
    //         {
    //             closestDistance = dist;
    //             closestBase = HomeBase(&base);
    //         }
    //     }
    //     // 2. Check all ships of the same side
    //     for (auto &s : ships)
    //     {
    //         if (s.sideName != a->sideName)
    //             continue;

    //         double dist = getDistanceBetweenTwoPoints(
    //             a->latitude, a->longitude, s.latitude, s.longitude);
    //         if (dist < closestDistance)
    //         {
    //             closestDistance = dist;
    //             closestBase = HomeBase(&s);
    //         }
    //     }
    //     return closestBase;
    // }

    // // ------------------------------------------------------------------------
    // // Return all "enemy" targets
    // // (Assumes each of these classes implements or derives from a common Target interface.)
    // // ------------------------------------------------------------------------
    // std::vector<Target *> getAllTargetsFromEnemySides(const std::string &sideName)
    // {
    //     std::vector<Target *> targets;

    //     for (auto &a : aircraft)
    //     {
    //         if (a.sideName != sideName)
    //         {
    //             // dynamic_cast<Target*>(&a) if these classes derive from Target
    //             targets.push_back(static_cast<Target *>(&a));
    //         }
    //     }
    //     for (auto &f : facilities)
    //     {
    //         if (f.sideName != sideName)
    //         {
    //             targets.push_back(static_cast<Target *>(&f));
    //         }
    //     }
    //     for (auto &s : ships)
    //     {
    //         if (s.sideName != sideName)
    //         {
    //             targets.push_back(static_cast<Target *>(&s));
    //         }
    //     }
    //     for (auto &base : airbases)
    //     {
    //         if (base.sideName != sideName)
    //         {
    //             targets.push_back(static_cast<Target *>(&base));
    //         }
    //     }
    //     return targets;
    // }

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
