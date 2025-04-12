import { useState } from "react";
import Card from "@mui/material/Card";
import { colorPalette } from "@/utils/constants";
import {
  Button,
  CardContent,
  Select,
  Stack,
  Box,
  MenuItem,
  Popover,
  Paper,
  FormControl,
} from "@mui/material";
import TextField from "@/gui/shared/ui/TextField";
import Side from "@/game/Side";
import { COLOR_PALETTE, SIDE_COLOR } from "@/utils/colors";
import EntityIcon from "@/gui/map/toolbar/EntityIcon";
import SelectField from "@/gui/shared/ui/SelectField";

interface SideEditorProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  side: Side | undefined;
  sides: Side[];
  hostiles: string[];
  allies: string[];
  updateSide: (
    sideId: string,
    sideName: string,
    sideColor: SIDE_COLOR,
    sideHostiles: string[],
    sideAllies: string[]
  ) => void;
  addSide: (
    sideName: string,
    sideColor: SIDE_COLOR,
    sideHostiles: string[],
    sideAllies: string[]
  ) => void;
  deleteSide: (sideId: string) => void;
  handleCloseOnMap: () => void;
}

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  rowGap: "10px",
};

const cardStyle = {
  backgroundColor: colorPalette.lightGray,
  color: "white",
};

const bottomButtonsStackStyle = {
  display: "flex",
  justifyContent: "center",
};

const editorButtonStyle = {
  color: colorPalette.white,
};

const SideEditor = (props: SideEditorProps) => {
  const [sideName, setSideName] = useState(props.side?.name ?? "");
  const [sideColor, setSideColor] = useState<SIDE_COLOR>(
    props.side?.color ?? SIDE_COLOR.BLUE
  );
  const [sideNameError, setSideNameError] = useState(false);
  const [sideRelationshipsError, setSideRelationshipsError] = useState(false);
  const [sideHostiles, setSideHostiles] = useState<string[]>(
    props.hostiles
      .map(
        (hostileId) =>
          props.sides.find((side) => side.id === hostileId)?.id ?? ""
      )
      .filter((id) => id !== "")
  );
  const [sideAllies, setSideAllies] = useState<string[]>(
    props.allies
      .map((allyId) => props.sides.find((side) => side.id === allyId)?.id ?? "")
      .filter((id) => id !== "")
  );
  const otherSides = props.sides.filter(
    (side: Side) =>
      (props.side?.id && side.id !== props.side?.id) || !props.side
  );

  const validateSidePropertiesInput = () => {
    if (sideName === "") {
      setSideNameError(true);
      return false;
    }
    if (sideHostiles.some((hostile) => sideAllies.includes(hostile))) {
      setSideRelationshipsError(true);
      return false;
    }
    setSideNameError(false);
    setSideRelationshipsError(false);
    return true;
  };

  const handleDeleteSide = () => {
    if (!props.side) return;
    props.deleteSide(props.side.id);
    props.handleCloseOnMap();
  };

  const handleUpdateSide = () => {
    if (!validateSidePropertiesInput() || !props.side) return;
    props.updateSide(
      props.side.id,
      sideName,
      sideColor,
      sideHostiles,
      sideAllies
    );
    props.handleCloseOnMap();
  };

  const handleAddSide = () => {
    if (!validateSidePropertiesInput()) return;
    props.addSide(sideName, sideColor, sideHostiles, sideAllies);
    props.handleCloseOnMap();
  };

  const handleClose = () => {
    props.handleCloseOnMap();
  };

  const cardContent = () => {
    return (
      <CardContent sx={cardContentStyle}>
        <Stack sx={bottomButtonsStackStyle} direction="row" spacing={2}>
          {/** Side Name Text Field */}
          <TextField
            id="side-name"
            label="Name"
            value={sideName}
            onChange={(event) => {
              setSideName(event.target.value);
            }}
            error={sideNameError}
            helperText={sideNameError ? "Name is required" : ""}
          />
          {/** Side Color Select Field */}
          {/** Side Color Preview */}
          <Select
            value={sideColor}
            onChange={(e) => setSideColor(e.target.value as SIDE_COLOR)}
            renderValue={() => (
              <Box display="flex" alignItems="center" gap={1}>
                <EntityIcon
                  type="circle"
                  color={sideColor}
                  width={20}
                  height={20}
                />
              </Box>
            )}
          >
            {Object.entries(SIDE_COLOR).map(([name, color]) => (
              <MenuItem
                key={color}
                value={color}
                sx={{
                  "&:hover": {
                    backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
                  },
                  "&.Mui-selected": {
                    backgroundColor: COLOR_PALETTE.LIGHT_GRAY,
                    "&:hover": {
                      backgroundColor: COLOR_PALETTE.DARK_GRAY,
                    },
                  },
                }}
              >
                <EntityIcon
                  type="circle"
                  color={color}
                  width={20}
                  height={20}
                />
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack sx={bottomButtonsStackStyle} direction="row" spacing={2}>
          <FormControl fullWidth sx={{ mb: 2 }} error={sideRelationshipsError}>
            <SelectField
              id="hostiles-selector"
              labelId="hostiles-selector-label"
              label="Enemies"
              selectItems={otherSides.map((side: Side) => {
                return {
                  name: side.name,
                  value: side.id,
                };
              })}
              value={sideHostiles}
              onChange={(value) => {
                setSideHostiles(value as string[]);
              }}
              multiple
            />
          </FormControl>
        </Stack>
        <FormControl fullWidth sx={{ mb: 2 }} error={sideRelationshipsError}>
          <SelectField
            id="allies-selector"
            labelId="allies-selector-label"
            label="Allies"
            selectItems={otherSides.map((side: Side) => {
              return {
                name: side.name,
                value: side.id,
              };
            })}
            value={sideAllies}
            onChange={(value) => {
              setSideAllies(value as string[]);
            }}
            multiple
          />
        </FormControl>
        {/* Form Action/Buttons */}
        <Stack sx={bottomButtonsStackStyle} direction="row" spacing={2}>
          {!props.side ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddSide}
              sx={editorButtonStyle}
            >
              ADD
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleDeleteSide}
                sx={editorButtonStyle}
              >
                DELETE
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpdateSide}
                sx={editorButtonStyle}
              >
                UPDATE
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    );
  };

  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      onClose={handleClose}
      component={Paper}
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Box>
        <Card sx={cardStyle}>{cardContent()}</Card>
      </Box>
    </Popover>
  );
};

export default SideEditor;
