#include <emscripten/bind.h>
#include "units/Aircraft.h"
#include "units/MovableUnit.h"
#include "core/Coordinates.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(AircraftModule)
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

    value_object<AircraftParameters>("AircraftParameters")
        .field("id", &AircraftParameters::id)
        .field("name", &AircraftParameters::name)
        .field("sideId", &AircraftParameters::sideId)
        .field("coordinates", &AircraftParameters::coordinates)
        .field("heading", &AircraftParameters::heading)
        .field("speed", &AircraftParameters::speed)
        .field("currentFuel", &AircraftParameters::currentFuel)
        .field("maxFuel", &AircraftParameters::maxFuel)
        .field("fuelRate", &AircraftParameters::fuelRate)
        .field("range", &AircraftParameters::range)
        .field("route", &AircraftParameters::route)
        .field("homeBaseId", &AircraftParameters::homeBaseId)
        .field("rtb", &AircraftParameters::rtb)
        .field("targetId", &AircraftParameters::targetId);

    class_<Aircraft, base<MovableUnit>>("Aircraft")
        .constructor<const AircraftParameters &>()

        .function("isRtb", &Aircraft::isRtb)
        .function("getHomeBaseId", &Aircraft::getHomeBaseId)
        .function("getTargetId", &Aircraft::getTargetId)
        .function("handleRtb", &Aircraft::handleRtb)
        .function("update", &Aircraft::update);
}
