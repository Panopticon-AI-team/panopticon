import React from "react";

import AirbaseCard from "./AirbaseCard"
import BasicPopover from "./MapPopup"
import Airbase from "../../game/Airbase";

export function createAirbaseCard(anchorPositionTop: number, anchorPositionLeft: number, handleAddAircraft: (airbaseId: string) => void, handleLaunchAircraft: (airbaseId: string) => void, handleCloseOnMap: () => void, airbase?: Airbase) {
    const airbaseId = airbase?.id ?? ''
    const airspaceCard = (
        <AirbaseCard airbase={airbase!} handleAddAircraftProp={() => {handleAddAircraft(airbaseId)}} handleLaunchAircraftProp={() => {handleLaunchAircraft(airbaseId)}}/>
    )
    return (
        <BasicPopover anchorPositionTop={anchorPositionTop} anchorPositionLeft={anchorPositionLeft} content={airspaceCard} handleCloseOnMap={handleCloseOnMap}></BasicPopover>
    )
}