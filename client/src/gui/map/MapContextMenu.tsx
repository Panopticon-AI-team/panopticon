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

  const commonPaperSx = {
    borderRadius: 2,
    boxShadow: 4,
    minWidth: 180,
    p: 0,
  };

  return (
    <>
      <Menu
        disableAutoFocusItem
        open
        onClose={closeAll}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchorPositionTop, left: anchorPositionLeft }}
        slotProps={{
          paper: { sx: commonPaperSx },
        }}
      >
        <MenuItem
          onClick={() => {
            handleAddReferencePoint();
            closeAll();
          }}
          sx={{ borderRadius: 1 }}
        >
          Add Reference Point
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleAddAirbase();
            closeAll();
          }}
          sx={{ borderRadius: 1 }}
        >
          Add Airbase
        </MenuItem>
        <MenuItem
          onClick={(e) => setAircraftMenuAnchor(e.currentTarget)}
          sx={{ justifyContent: "space-between", borderRadius: 1 }}
        >
          <span>Add Aircraft</span>
          <span>▶</span>
        </MenuItem>
        <MenuItem
          onClick={(e) => setShipMenuAnchor(e.currentTarget)}
          sx={{ justifyContent: "space-between", borderRadius: 1 }}
        >
          <span>Add Ship</span>
          <span>▶</span>
        </MenuItem>
        <MenuItem
          onClick={(e) => setFacilityMenuAnchor(e.currentTarget)}
          sx={{ justifyContent: "space-between", borderRadius: 1 }}
        >
          <span>Add Facility</span>
          <span>▶</span>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={aircraftMenuAnchor}
        open={Boolean(aircraftMenuAnchor)}
        onClose={() => setAircraftMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: commonPaperSx },
          list: { onMouseLeave: () => setAircraftMenuAnchor(null) },
        }}
      >
        {AircraftDb.map((aircraft) => (
          <MenuItem
            key={aircraft.className}
            onClick={() => {
              handleAddAircraft(aircraft.className);
              closeAll();
            }}
            sx={{ borderRadius: 1 }}
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
        slotProps={{
          paper: { sx: commonPaperSx },
          list: { onMouseLeave: () => setShipMenuAnchor(null) },
        }}
      >
        {ShipDb.map((ship) => (
          <MenuItem
            key={ship.className}
            onClick={() => {
              handleAddShip(ship.className);
              closeAll();
            }}
            sx={{ borderRadius: 1 }}
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
        slotProps={{
          paper: { sx: commonPaperSx },
          list: { onMouseLeave: () => setFacilityMenuAnchor(null) },
        }}
      >
        {FacilityDb.map((facility) => (
          <MenuItem
            key={facility.className}
            onClick={() => {
              handleAddFacility(facility.className);
              closeAll();
            }}
            sx={{ borderRadius: 1 }}
          >
            {facility.className}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
