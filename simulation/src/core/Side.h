#pragma once

#include <string>
#include <vector>

#include <units/Airbase.h>
#include <units/Aircraft.h>

struct SideParameters
{
    std::string id;
    std::string name;
    std::string color;
    double totalScore = 0.0;
};

class Side
{
public:
    Side(const SideParameters &params)
        : m_id(params.id), m_name(params.name), m_color(params.color), m_totalScore(params.totalScore)
    {
    }

    virtual ~Side() = default;

    const std::string &getId() const { return m_id; }
    const std::string &getName() const { return m_name; }
    const std::string &getColor() const { return m_color; }
    double getTotalScore() const { return m_totalScore; }

    void setId(const std::string &id) { m_id = id; }
    void setName(const std::string &name) { m_name = name; }
    void setColor(const std::string &color) { m_color = color; }
    void setTotalScore(double totalScore) { m_totalScore = totalScore; }

private:
    std::string m_id;
    std::string m_name;
    std::string m_color;
    double m_totalScore;
};
