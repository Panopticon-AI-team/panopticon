import React from "react";

import AirbaseCard from "./AirbaseCard"
import FeaturePopup from "./FeaturePopup"
import Airbase from "../../game/Airbase";

export function createAirbaseCard(anchorPositionTop: number, anchorPositionLeft: number, handleAddAircraft: (airbaseId: string) => void, handleLaunchAircraft: (airbaseId: string) => void, handleCloseOnMap: () => void, airbase?: Airbase) {
    const airbaseId = airbase?.id ?? ''
    const airspaceCard = (
        <AirbaseCard airbase={airbase!} handleAddAircraftProp={() => {handleAddAircraft(airbaseId)}} handleLaunchAircraftProp={() => {handleLaunchAircraft(airbaseId)}}/>
    )
    return (
        <FeaturePopup anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={airspaceCard} handleCloseOnMap={handleCloseOnMap}></FeaturePopup>
    )
}