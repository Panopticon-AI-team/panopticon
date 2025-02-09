#pragma once

#include "core/Coordinates.h"
#include <string>

struct UnitParameters
{
    std::string id;
    std::string name;
    std::string className;
    std::string sideId;
    Coordinates coordinates;
    bool selected = false;
};

class Unit
{
public:
    Unit(const UnitParameters &params) : m_id(params.id), m_name(params.name), m_className(params.className), m_sideId(params.sideId), m_coordinates(params.coordinates), m_selected(params.selected) {};
    virtual ~Unit() = default;

    const std::string &getId() const { return m_id; }
    const std::string &getName() const { return m_name; }
    const std::string &getClassName() const { return m_className; }
    const std::string &getSideId() const { return m_sideId; }
    const Coordinates &getCoordinates() const { return m_coordinates; }
    bool isSelected() const { return m_selected; }

    void setLatitude(double latitude) { m_coordinates.setLatitude(latitude); }
    void setLongitude(double longitude) { m_coordinates.setLongitude(longitude); }
    void setAltitude(double altitude) { m_coordinates.setAltitude(altitude); }

    virtual void update(double dt) = 0;

private:
    std::string m_id;
    std::string m_name;
    std::string m_className;
    std::string m_sideId;
    Coordinates m_coordinates;
    bool m_selected;
};
