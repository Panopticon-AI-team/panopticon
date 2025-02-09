#pragma once

#include "MovableUnit.h"
#include <string>

struct AircraftParameters : public MovableUnitParameters
{
    std::string homeBaseId;
    bool rtb = false;
    std::string targetId;
};

class Aircraft : public MovableUnit
{
public:
    explicit Aircraft(const AircraftParameters &params);

    virtual ~Aircraft() = default;

    bool isRtb() const { return m_rtb; }
    const std::string &getHomeBaseId() const { return m_homeBaseId; }
    const std::string &getTargetId() const { return m_targetId; }

    bool handleRtb();
    void update(double dt) override;

private:
    std::string m_homeBaseId;
    bool m_rtb;
    std::string m_targetId;
};
