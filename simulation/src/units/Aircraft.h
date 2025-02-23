#pragma once

#include "MovableUnit.h"
#include <string>

struct AircraftParameters : public MovableUnitParameters
{
    std::string homeBaseId;
    bool returnToBase = false;
    std::string targetId;
};

class Aircraft : public MovableUnit
{
public:
    explicit Aircraft(const AircraftParameters &params);

    virtual ~Aircraft() = default;

    const std::string &getHomeBaseId() const { return m_homeBaseId; }
    bool isReturnToBase() const { return m_returnToBase; }
    const std::string &getTargetId() const { return m_targetId; }

    void setHomeBaseId(const std::string &homeBaseId) { m_homeBaseId = homeBaseId; }
    void setReturnToBase(bool returnToBase) { m_returnToBase = returnToBase; }
    void setTargetId(const std::string &targetId) { m_targetId = targetId; }

    bool handleReturnToBase();
    void update(double dt) override;

private:
    std::string m_homeBaseId;
    bool m_returnToBase;
    std::string m_targetId;
};
