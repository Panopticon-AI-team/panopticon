import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AircraftDb, FacilityDb, ShipDb } from "@/game/db/UnitDb";

interface MapContextMenuProps {
  anchorPositionTop: number;
  anchorPositionLeft: number;
  handleCloseOnMap: () => void;
  handleAddReferencePoint: () => void;
  handleAddAirbase: () => void;
  handleAddAircraft: (unitClassName: string) => void;
  handleAddShip: (unitClassName: string) => void;
  handleAddFacility: (unitClassName: string) => void;
}

export default function MapContextMenu({
  anchorPositionTop,
  anchorPositionLeft,
  handleCloseOnMap,
  handleAddReferencePoint,
  handleAddAirbase,
  handleAddAircraft,
  handleAddShip,
  handleAddFacility,
}: Readonly<MapContextMenuProps>) {
  const [aircraftMenuAnchor, setAircraftMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [shipMenuAnchor, setShipMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  const [facilityMenuAnchor, setFacilityMenuAnchor] =
    useState<HTMLElement | null>(null);

  const closeAll = () => {
    setAircraftMenuAnchor(null);
    setShipMenuAnchor(null);
    setFacilityMenuAnchor(null);
    handleCloseOnMap();
  };

  return (
    <>
      <Menu
        open
        onClose={closeAll}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchorPositionTop, left: anchorPositionLeft }}
      >
        <MenuItem
          onClick={() => {
            handleAddReferencePoint();
            handleCloseOnMap();
          }}
        >
          Add Reference Point
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleAddAirbase();
            handleCloseOnMap();
          }}
        >
          Add Airbase
        </MenuItem>
        <MenuItem onClick={(e) => setAircraftMenuAnchor(e.currentTarget)}>
          Add Aircraft ▶
        </MenuItem>
        <MenuItem onClick={(e) => setShipMenuAnchor(e.currentTarget)}>
          Add Ship ▶
        </MenuItem>
        <MenuItem onClick={(e) => setFacilityMenuAnchor(e.currentTarget)}>
          Add Facility ▶
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={aircraftMenuAnchor}
        open={Boolean(aircraftMenuAnchor)}
        onClose={() => setAircraftMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {AircraftDb.map((aircraft) => (
          <MenuItem
            key={aircraft.className}
            onClick={() => {
              handleAddAircraft(aircraft.className);
              closeAll();
            }}
          >
            {aircraft.className}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={shipMenuAnchor}
        open={Boolean(shipMenuAnchor)}
        onClose={() => setShipMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {ShipDb.map((ship) => (
          <MenuItem
            key={ship.className}
            onClick={() => {
              handleAddShip(ship.className);
              closeAll();
            }}
          >
            {ship.className}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={facilityMenuAnchor}
        open={Boolean(facilityMenuAnchor)}
        onClose={() => setFacilityMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {FacilityDb.map((facility) => (
          <MenuItem
            key={facility.className}
            onClick={() => {
              handleAddFacility(facility.className);
              closeAll();
            }}
          >
            {facility.className}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
