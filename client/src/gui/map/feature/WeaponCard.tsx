import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FeaturePopup from "@/gui/map/FeaturePopup";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import TelegramIcon from "@mui/icons-material/Telegram";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Menu } from "@/gui/shared/ui/MuiComponents";
import { colorPalette } from "@/utils/constants";
import Weapon from "@/game/units/Weapon";

interface WeaponCardProps {
  weapon: Weapon;
  sideName: string;
  handleTeleportUnit: (unitId: string) => void;
  handleDeleteWeapon: (weaponId: string) => void;
  handleCloseOnMap: () => void;
  anchorPositionTop: number;
  anchorPositionLeft: number;
}

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

export default function WeaponCard(props: Readonly<WeaponCardProps>) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const _handleTeleportWeapon = () => {
    props.handleCloseOnMap();
    props.handleTeleportUnit(props.weapon.id);
  };

  const _handleDeleteWeapon = () => {
    props.handleCloseOnMap();
    props.handleDeleteWeapon(props.weapon.id);
  };

  const weaponDataContent = (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        maxWidth: 600,
        minWidth: 350,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Table size="small" aria-label="facility-feature-table">
        <TableBody>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Coordinates:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.weapon.latitude.toFixed(2)},{" "}
              {props.weapon.longitude.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Speed:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.weapon.speed.toFixed(0)} KTS
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Altitude:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.weapon.altitude.toFixed(2)} FT
            </TableCell>
          </TableRow>
          <TableRow sx={tableRowStyle}>
            <TableCell component="th" scope="row" sx={tableKeyCellStyle}>
              Engagement Range:
            </TableCell>
            <TableCell align="right" sx={tableValueCellStyle}>
              {props.weapon.getEngagementRange().toFixed(0)} NM
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const defaultCardActions = (
    <Stack spacing={0.5} direction="column" onMouseLeave={handleClose}>
      <ListItemButton onClick={_handleTeleportWeapon}>
        <TelegramIcon sx={{ mr: 0.5 }} /> Edit Location
      </ListItemButton>
    </Stack>
  );

  const WeaponCard = (
    <Box sx={{ minWidth: 150 }}>
      <Card
        sx={{
          backgroundColor: "#282c34",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <CardHeader
          action={
            <Stack direction={"row"} spacing={0}>
              <Tooltip title={`Delete ${props.weapon.name}`}>
                <IconButton onClick={_handleDeleteWeapon}>
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={`More Actions`}>
                <Button
                  id="facility-feature-actions-button"
                  aria-controls={
                    open ? "facility-feature-actions-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="outlined"
                  size="small"
                  color="inherit"
                >
                  Actions
                </Button>
              </Tooltip>
              <Menu
                id="facility-feature-actions-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  root: { sx: { ".MuiList-root": { padding: 0 } } },
                  list: {
                    "aria-labelledby": "facility-feature-actions-button",
                  },
                }}
              >
                {defaultCardActions}
              </Menu>
            </Stack>
          }
          title={
            <Typography variant="h6" component="div">
              {props.weapon.name}
            </Typography>
          }
          subheader={
            <Stack
              direction={"column"}
              spacing={0}
              sx={{ color: colorPalette.lightGray }}
            >
              <Typography variant="caption">
                Type: {props.weapon.className}
              </Typography>
              <Typography variant="caption">
                Side:{" "}
                <Typography variant="caption" component={"span"}>
                  {props.sideName}
                </Typography>
              </Typography>
            </Stack>
          }
        />
        <Divider
          orientation="horizontal"
          variant="middle"
          flexItem
          sx={{ borderColor: "white", mb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>{weaponDataContent}</CardContent>
      </Card>
    </Box>
  );

  return (
    <FeaturePopup
      anchorPositionTop={props.anchorPositionTop}
      anchorPositionLeft={props.anchorPositionLeft}
      content={WeaponCard}
      handleCloseOnMap={props.handleCloseOnMap}
    ></FeaturePopup>
  );
}
