#include <emscripten/bind.h>

#include "core/Coordinates.h"
#include "core/Scenario.h"
#include "core/Side.h"
#include "units/Airbase.h"
#include "units/Aircraft.h"
#include "units/MovableUnit.h"
#include "units/Unit.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(SimulationModule)
{
    class_<Coordinates>("Coordinates")
        .constructor<>()
        .constructor<double, double, double>()
        .property("latitude",
                  &Coordinates::getLatitude,
                  &Coordinates::setLatitude)
        .property("longitude",
                  &Coordinates::getLongitude,
                  &Coordinates::setLongitude)
        .property("altitude",
                  &Coordinates::getAltitude,
                  &Coordinates::setAltitude);

    // value_object<AirbaseParameters>("AirbaseParameters")
    //     .field("id", &AirbaseParameters::id)
    //     .field("name", &AirbaseParameters::name)
    //     .field("className", &AirbaseParameters::className)
    //     .field("sideId", &AirbaseParameters::sideId)
    //     .field("latitude", &AirbaseParameters::latitude)
    //     .field("longitude", &AirbaseParameters::longitude)
    //     .field("altitude", &AirbaseParameters::altitude)
    //     .field("selected", &AirbaseParameters::selected)
    //     .field("basedAircraft", &AirbaseParameters::basedAircraft);

    // class_<Airbase, base<Unit>>("Airbase")
    //     .constructor<const AirbaseParameters &>()
    //     .property("id", &Airbase::getId, &Airbase::setId)
    //     .property("name", &Airbase::getName, &Airbase::setName)
    //     .property("className", &Airbase::getClassName, &Airbase::setClassName)
    //     .property("sideId", &Airbase::getSideId, &Airbase::setSideId)
    //     .property("coordinates",
    //               &Airbase::getCoordinates,
    //               &Airbase::setCoordinates)
    //     .property("selected", &Airbase::isSelected, &Airbase::setSelected)
    //     .property("basedAircraft",
    //               &Airbase::getBasedAircraft,
    //               &Airbase::setBasedAircraft)
    //     .function("setLatitude", &Airbase::setLatitude)
    //     .function("setLongitude", &Airbase::setLongitude)
    //     .function("setAltitude", &Airbase::setAltitude)
    //     .function("addBasedAircraft", &Airbase::addBasedAircraft)
    //     .function("removeBasedAircraft", &Airbase::removeBasedAircraft);

    // value_object<UnitParameters>("UnitParameters")
    //     .field("id", &UnitParameters::id)
    //     .field("name", &UnitParameters::name)
    //     .field("className", &UnitParameters::className)
    //     .field("sideId", &UnitParameters::sideId)
    //     .field("latitude", &UnitParameters::latitude)
    //     .field("longitude", &UnitParameters::longitude)
    //     .field("altitude", &UnitParameters::altitude)
    //     .field("selected", &UnitParameters::selected);

    class_<Unit>("Unit");
    //     .constructor<const UnitParameters &>();
    // .property("id", &Unit::getId, &Unit::setId)
    // .property("name", &Unit::getName, &Unit::setName)
    // .property("className", &Unit::getClassName, &Unit::setClassName)
    // .property("sideId", &Unit::getSideId, &Unit::setSideId)
    // .property("coordinates",
    //           &Unit::getCoordinates,
    //           &Unit::setCoordinates)
    // .property("selected", &Unit::isSelected, &Unit::setSelected)
    // .function("setLatitude", &Unit::setLatitude)
    // .function("setLongitude", &Unit::setLongitude)
    // .function("setAltitude", &Unit::setAltitude);

    value_object<MovableUnitParameters>("MovableUnitParameters")
        .field("id", &MovableUnitParameters::id)
        .field("name", &MovableUnitParameters::name)
        .field("className", &MovableUnitParameters::className)
        .field("sideId", &MovableUnitParameters::sideId)
        .field("latitude", &MovableUnitParameters::latitude)
        .field("longitude", &MovableUnitParameters::longitude)
        .field("altitude", &MovableUnitParameters::altitude)
        .field("selected", &MovableUnitParameters::selected)
        .field("heading", &MovableUnitParameters::heading)
        .field("speedKnots", &MovableUnitParameters::speedKnots)
        .field("currentFuelLbs", &MovableUnitParameters::currentFuelLbs)
        .field("maxFuelLbs", &MovableUnitParameters::maxFuelLbs)
        .field("fuelRateLbsPerHour", &MovableUnitParameters::fuelRateLbsPerHour);
    // .field("route", &MovableUnitParameters::route);

    class_<MovableUnit, base<Unit>>("MovableUnit")
        .constructor<const MovableUnitParameters &>();
    // .property("id", &MovableUnit::getId, &MovableUnit::setId)
    // .property("name", &MovableUnit::getName, &MovableUnit::setName)
    // .property("className", &MovableUnit::getClassName, &MovableUnit::setClassName)
    // .property("sideId", &MovableUnit::getSideId, &MovableUnit::setSideId)
    // .property("latitude", &MovableUnit::getLatitude, &MovableUnit::setLatitude)
    // .property("longitude", &MovableUnit::getLongitude, &MovableUnit::setLongitude)
    // .property("altitude", &MovableUnit::getAltitude, &MovableUnit::setAltitude)
    // .property("selected", &MovableUnit::isSelected, &MovableUnit::setSelected)
    // .property("heading", &MovableUnit::getHeading, &MovableUnit::setHeading)
    // .property("speedKnots", &MovableUnit::getSpeedKnots, &MovableUnit::setSpeedKnots)
    // .property("currentFuelLbs", &MovableUnit::getCurrentFuelLbs, &MovableUnit::setCurrentFuelLbs)
    // .property("maxFuelLbs", &MovableUnit::getMaxFuelLbs, &MovableUnit::setMaxFuelLbs)
    // .property("fuelRateLbsPerHour", &MovableUnit::getFuelRateLbsPerHour, &MovableUnit::setFuelRateLbsPerHour);

    value_object<AircraftParameters>("AircraftParameters")
        .field("id", &AircraftParameters::id)
        .field("name", &AircraftParameters::name)
        .field("className", &AircraftParameters::className)
        .field("sideId", &AircraftParameters::sideId)
        .field("latitude", &AircraftParameters::latitude)
        .field("longitude", &AircraftParameters::longitude)
        .field("altitude", &AircraftParameters::altitude)
        .field("selected", &AircraftParameters::selected)
        .field("heading", &AircraftParameters::heading)
        .field("speedKnots", &AircraftParameters::speedKnots)
        .field("currentFuelLbs", &AircraftParameters::currentFuelLbs)
        .field("maxFuelLbs", &AircraftParameters::maxFuelLbs)
        .field("fuelRateLbsPerHour", &AircraftParameters::fuelRateLbsPerHour)
        // .field("route", &AircraftParameters::route)
        .field("homeBaseId", &AircraftParameters::homeBaseId)
        .field("returnToBase", &AircraftParameters::returnToBase)
        .field("targetId", &AircraftParameters::targetId);

    class_<Aircraft, base<MovableUnit>>("Aircraft")
        .constructor<const AircraftParameters &>()
        .property("id", &Aircraft::getId, &Aircraft::setId)
        .property("name", &Aircraft::getName, &Aircraft::setName)
        .property("className", &Aircraft::getClassName, &Aircraft::setClassName)
        .property("sideId", &Aircraft::getSideId, &Aircraft::setSideId)
        .property("coordinates",
                  &Aircraft::getCoordinates,
                  &Aircraft::setCoordinates)
        .property("selected", &Aircraft::isSelected, &Aircraft::setSelected)
        .property("heading", &Aircraft::getHeading, &Aircraft::setHeading)
        .property("speedKnots", &Aircraft::getSpeedKnots, &Aircraft::setSpeedKnots)
        .property("currentFuelLbs", &Aircraft::getCurrentFuelLbs, &Aircraft::setCurrentFuelLbs)
        .property("maxFuelLbs", &Aircraft::getMaxFuelLbs, &Aircraft::setMaxFuelLbs)
        .property("fuelRateLbsPerHour", &Aircraft::getFuelRateLbsPerHour, &Aircraft::setFuelRateLbsPerHour)
        // .property("route", &Aircraft::getRoute, &Aircraft::setRoute)
        .property("homeBaseId", &Aircraft::getHomeBaseId, &Aircraft::setHomeBaseId)
        .property("returnToBase", &Aircraft::isReturnToBase, &Aircraft::setReturnToBase)
        .property("targetId", &Aircraft::getTargetId, &Aircraft::setTargetId);

    //     .function("isReturnToBase", &Aircraft::isReturnToBase)
    //     .function("getHomeBaseId", &Aircraft::getHomeBaseId)
    //     .function("getTargetId", &Aircraft::getTargetId)
    //     .function("setReturnToBase", &Aircraft::setReturnToBase)
    //     .function("setHomeBaseId", &Aircraft::setHomeBaseId)
    //     .function("setTargetId", &Aircraft::setTargetId)
    //     .function("handleReturnToBase", &Aircraft::handleReturnToBase);

    // value_object<SideParameters>("SideParameters")
    //     .field("id", &SideParameters::id)
    //     .field("name", &SideParameters::name)
    //     .field("color", &SideParameters::color)
    //     .field("totalScore", &SideParameters::totalScore);

    // class_<Side>("Side")
    //     .constructor<const SideParameters &>();
    // .function("getId", &Side::getId)
    // .function("getName", &Side::getName)
    // .function("getTotalScore", &Side::getTotalScore)
    // .function("getAirbases", &Side::getAirbases)
    // .function("getAircraft", &Side::getAircraft)
    // .function("setTotalScore", &Side::setTotalScore)
    // .function("setName", &Side::setName)
    // .function("setAirbases", &Side::setAirbases)
    // .function("setAircraft", &Side::setAircraft)
    // .function("addAirbase", &Side::addAirbase)
    // .function("addAircraft", &Side::addAircraft);
    // .function("findAircraft", &Side::findAircraft)
    // .function("findAirbase", &Side::findAirbase);

    value_object<ScenarioParameters>("ScenarioParameters")
        .field("id", &ScenarioParameters::id)
        .field("name", &ScenarioParameters::name)
        .field("startTime", &ScenarioParameters::startTime)
        .field("currentTime", &ScenarioParameters::currentTime)
        .field("durationSeconds", &ScenarioParameters::durationSeconds)
        .field("timeCompression", &ScenarioParameters::timeCompression);

    register_vector<Aircraft>("VectorAircraft");

    class_<Scenario>("Scenario")
        .constructor<const ScenarioParameters &>()
        .property("id", &Scenario::getId, &Scenario::setId)
        .property("name", &Scenario::getName, &Scenario::setName)
        .property("startTime", &Scenario::getStartTime, &Scenario::setStartTime)
        .property("currentTime", &Scenario::getCurrentTime, &Scenario::setCurrentTime)
        .property("durationSeconds", &Scenario::getDurationSeconds, &Scenario::setDurationSeconds)
        .property("timeCompression", &Scenario::getTimeCompression, &Scenario::setTimeCompression)
        .property("aircraft", &Scenario::getAircraft, &Scenario::setAircraft)
        .function("getAircraftByIdAndSideId", &Scenario::getAircraftByIdAndSideId, allow_raw_pointers())
        .function("update", &Scenario::update)
        // .function("getAircraftIterator", &Scenario::getAircraftIterator)
        // .function("getAircraft", &Scenario::getAircraft, allow_raw_pointers())
        .function("addAircraft", &Scenario::addAircraft);
    // .function("removeAircraft", &Scenario::removeAircraft);
}
