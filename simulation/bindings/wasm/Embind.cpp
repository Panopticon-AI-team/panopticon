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
    register_vector<Aircraft>("VectorAircraft");
    register_vector<Coordinates>("VectorCoordinates");
    register_vector<Side>("VectorSides");

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

    class_<Unit>("Unit");
    class_<MovableUnit, base<Unit>>("MovableUnit");

    value_object<AircraftParameters>("AircraftParameters")
        // Unit Parameters
        .field("id", &AircraftParameters::id)
        .field("name", &AircraftParameters::name)
        .field("className", &AircraftParameters::className)
        .field("sideId", &AircraftParameters::sideId)
        .field("latitude", &AircraftParameters::latitude)
        .field("longitude", &AircraftParameters::longitude)
        .field("altitude", &AircraftParameters::altitude)
        .field("selected", &AircraftParameters::selected)
        // MovableUnit Parameters
        .field("heading", &AircraftParameters::heading)
        .field("speedKnots", &AircraftParameters::speedKnots)
        .field("currentFuelLbs", &AircraftParameters::currentFuelLbs)
        .field("maxFuelLbs", &AircraftParameters::maxFuelLbs)
        .field("fuelRateLbsPerHour", &AircraftParameters::fuelRateLbsPerHour)
        // Aircraft Parameters
        .field("homeBaseId", &AircraftParameters::homeBaseId)
        .field("returnToBase", &AircraftParameters::returnToBase)
        .field("targetId", &AircraftParameters::targetId);

    class_<Aircraft, base<MovableUnit>>("Aircraft")
        .constructor<const AircraftParameters &>()
        // Unit Fields
        .property("id", &Aircraft::getId, &Aircraft::setId)
        .property("name", &Aircraft::getName, &Aircraft::setName)
        .property("className", &Aircraft::getClassName, &Aircraft::setClassName)
        .property("sideId", &Aircraft::getSideId, &Aircraft::setSideId)
        .property("coordinates",
                  &Aircraft::getCoordinates,
                  &Aircraft::setCoordinates)
        .property("selected", &Aircraft::isSelected, &Aircraft::setSelected)
        // MovableUnit Fields
        .property("heading", &Aircraft::getHeading, &Aircraft::setHeading)
        .property("speedKnots", &Aircraft::getSpeedKnots, &Aircraft::setSpeedKnots)
        .property("currentFuelLbs", &Aircraft::getCurrentFuelLbs, &Aircraft::setCurrentFuelLbs)
        .property("maxFuelLbs", &Aircraft::getMaxFuelLbs, &Aircraft::setMaxFuelLbs)
        .property("fuelRateLbsPerHour", &Aircraft::getFuelRateLbsPerHour, &Aircraft::setFuelRateLbsPerHour)
        .property("route", &Aircraft::getRoute, &Aircraft::setRoute)
        // Aircraft Fields
        .property("homeBaseId", &Aircraft::getHomeBaseId, &Aircraft::setHomeBaseId)
        .property("returnToBase", &Aircraft::isReturnToBase, &Aircraft::setReturnToBase)
        .property("targetId", &Aircraft::getTargetId, &Aircraft::setTargetId)
        // MovableUnit Methods
        .function("addPointToRoute", &Aircraft::addPointToRoute)
        .function("clearFirstNPointsFromRoute", &Aircraft::clearFirstNPointsFromRoute)
        .function("clearLastNPointsFromRoute", &Aircraft::clearLastNPointsFromRoute)
        .function("clearRoute", &Aircraft::clearRoute)
        // Aircraft Methods
        .function("update", &Aircraft::update);

    value_object<ScenarioParameters>("ScenarioParameters")
        .field("id", &ScenarioParameters::id)
        .field("name", &ScenarioParameters::name)
        .field("startTime", &ScenarioParameters::startTime)
        .field("currentTime", &ScenarioParameters::currentTime)
        .field("durationSeconds", &ScenarioParameters::durationSeconds)
        .field("timeCompression", &ScenarioParameters::timeCompression);

    class_<Scenario>("Scenario")
        .constructor<const ScenarioParameters &>()
        // Class Fields
        .property("id", &Scenario::getId, &Scenario::setId)
        .property("name", &Scenario::getName, &Scenario::setName)
        .property("startTime", &Scenario::getStartTime, &Scenario::setStartTime)
        .property("currentTime", &Scenario::getCurrentTime, &Scenario::setCurrentTime)
        .property("durationSeconds", &Scenario::getDurationSeconds, &Scenario::setDurationSeconds)
        .property("timeCompression", &Scenario::getTimeCompression, &Scenario::setTimeCompression)
        .property("aircraft", &Scenario::getAircraft, &Scenario::setAircraft)
        .property("sides", &Scenario::getSides, &Scenario::setSides)
        // Class Methods
        .function("getAircraftByIdAndSideId", &Scenario::getAircraftByIdAndSideId, allow_raw_pointers())
        .function("addAircraft", &Scenario::addAircraft)
        .function("removeAircraft", &Scenario::removeAircraft)
        .function("getSideById", &Scenario::getSideById, allow_raw_pointers())
        .function("addSide", &Scenario::addSide)
        .function("removeSide", &Scenario::removeSide)
        .function("update", &Scenario::update);

    value_object<SideParameters>("SideParameters")
        .field("id", &SideParameters::id)
        .field("name", &SideParameters::name)
        .field("color", &SideParameters::color)
        .field("totalScore", &SideParameters::totalScore);

    class_<Side>("Side")
        .constructor<const SideParameters &>()
        // Class Fields
        .property("id", &Side::getId, &Side::setId)
        .property("name", &Side::getName, &Side::setName)
        .property("color", &Side::getColor, &Side::setColor)
        .property("totalScore", &Side::getTotalScore, &Side::setTotalScore);
}
