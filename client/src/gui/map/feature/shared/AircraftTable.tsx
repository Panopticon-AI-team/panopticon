import { useContext, useState } from "react";
import { Add, Delete, Flight } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { UnitDbContext } from "@/gui/contextProviders/contexts/UnitDbContext";
import Aircraft from "@/game/units/Aircraft";
import Ship from "@/game/units/Ship";
import Airbase from "@/game/units/Airbase";

const tableRowStyle = {
  border: 0,
};

const tableKeyCellStyle = {
  whiteSpace: "nowrap",
  color: "white",
  border: "none",
  p: 0.5,
  typography: "body1",
};

const tableValueCellStyle = {
  wordBreak: "break-word",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 200,
  color: "white",
  border: "none",
  p: 0.5,
  typography: "body1",
};

interface AircraftTableProps {
  unitWithAircraft: Airbase | Ship;
  handleAddAircraft: (baseId: string, aircraftClassName: string) => Aircraft[];
  handleDeleteAircraft: (baseId: string, aircraftId: string) => Aircraft[];
  handleLaunchAircraft: (baseId: string, aircraftId: string) => Aircraft[];
  handleCloseOnMap: () => void;
}

export default function AircraftTable(props: Readonly<AircraftTableProps>) {
  const [baseAircraft, setBaseAircraft] = useState(
    props.unitWithAircraft.aircraft
  );
  const unitDbContext = useContext(UnitDbContext);

  const [addAircraftMenuAnchorEl, setAddAircraftMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const openAddWeaponMenu = Boolean(addAircraftMenuAnchorEl);
  const handleClickAddAircraftButton = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAddAircraftMenuAnchorEl(event.currentTarget);
  };
  const handleCloseAddAircraftMenu = () => {
    setAddAircraftMenuAnchorEl(null);
  };

  const _handleAddAircraft = (aircraftClassName: string) => {
    const baseAircraft = props.handleAddAircraft(
      props.unitWithAircraft.id,
      aircraftClassName
    );
    setBaseAircraft([...baseAircraft]);
  };

  const _handleDeleteAircraft = (aircraftId: string) => {
    const baseAircraft = props.handleDeleteAircraft(
      props.unitWithAircraft.id,
      aircraftId
    );
    setBaseAircraft([...baseAircraft]);
  };

  const _handleLaunchAircraft = (aircraftId: string) => {
    const baseAircraft = props.handleLaunchAircraft(
      props.unitWithAircraft.id,
      aircraftId
    );
    setBaseAircraft([...baseAircraft]);
  };

  const ellipsifyAircraftName = (name: string) => {
    const maxLength = 20;
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  };

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            minWidth: 600,
            maxHeight: 300,
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <Table
            stickyHeader
            size="small"
            aria-label="unitWithAircraft-aircraft-table"
          >
            <TableHead>
              <TableRow sx={{ ...tableRowStyle }}>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  sx={{ ...tableKeyCellStyle, backgroundColor: "#282c34" }}
                >
                  Name
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  sx={{
                    ...tableKeyCellStyle,
                    backgroundColor: "#282c34",
                    minWidth: "6em",
                  }}
                >
                  Class
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  sx={{
                    ...tableKeyCellStyle,
                    backgroundColor: "#282c34",
                    minWidth: "6em",
                  }}
                >
                  Fuel
                </TableCell>
                <TableCell
                  align="right"
                  component="th"
                  scope="row"
                  sx={{
                    ...tableKeyCellStyle,
                    backgroundColor: "#282c34",
                    minWidth: "5em",
                  }}
                >
                  <Tooltip title={`Add Aircraft`}>
                    <IconButton
                      id={"add-aircraft-button"}
                      onClick={handleClickAddAircraftButton}
                    >
                      <Add sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {baseAircraft.length === 0 && (
                <TableRow sx={tableRowStyle}>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ ...tableValueCellStyle, color: "gray" }}
                  >
                    No Aircraft Available
                  </TableCell>
                </TableRow>
              )}
              {baseAircraft.length > 0 &&
                baseAircraft.map((aircraft, index) => (
                  <TableRow sx={tableRowStyle} key={aircraft.id}>
                    <TableCell align="right" sx={tableValueCellStyle}>
                      {ellipsifyAircraftName(aircraft.name)}
                    </TableCell>
                    <TableCell align="right" sx={tableValueCellStyle}>
                      {aircraft.className}
                    </TableCell>
                    <TableCell align="right" sx={tableValueCellStyle}>
                      {aircraft.currentFuel}
                    </TableCell>
                    <TableCell align="right" sx={tableValueCellStyle}>
                      <>
                        <Tooltip title={`Launch Aircraft`}>
                          <IconButton
                            onClick={() => {
                              _handleLaunchAircraft(aircraft.id);
                            }}
                          >
                            <Flight sx={{ color: "white" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Delete Aircraft`}>
                          <IconButton
                            onClick={() => _handleDeleteAircraft(aircraft.id)}
                          >
                            <Delete sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Menu
        id="add-aircraft-menu"
        anchorEl={addAircraftMenuAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={openAddWeaponMenu}
        onClose={handleCloseAddAircraftMenu}
        slotProps={{
          root: { sx: { ".MuiList-root": { padding: 0 } } },
          list: {
            "aria-labelledby": "add-aircraft-button",
          },
        }}
      >
        {unitDbContext.getAircraftDb().map((aircraft) => (
          <Tooltip
            key={aircraft.className}
            placement="right"
            arrow
            title={
              <Stack direction={"column"} spacing={0.1}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Speed: {aircraft.speed.toFixed(0)} kts
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Max Fuel: {aircraft.maxFuel.toFixed(2)} lbs
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Fuel Consumption: {aircraft.fuelRate.toFixed(2)} lbs/hr
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Detection Range: {aircraft.range.toFixed(0)} nm
                </Typography>
              </Stack>
            }
          >
            <MenuItem
              onClick={() => {
                _handleAddAircraft(aircraft.className);
                handleCloseAddAircraftMenu();
              }}
              sx={{ borderRadius: 1 }}
            >
              {aircraft.className}
            </MenuItem>
          </Tooltip>
        ))}
      </Menu>
    </>
  );
}
