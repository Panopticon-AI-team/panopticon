import { useEffect, useState } from "react";
import Side from "@/game/Side";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import EntityIcon from "@/gui/map/toolbar/EntityIcon";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

interface SideSelectProps {
  sides: Side[];
  currentSideId: string;
  onSideSelect: (sideId: string) => void;
  openSideEditor: (sideId: string | null) => void;
}

export default function SideSelect(props: Readonly<SideSelectProps>) {
  const [selectedSide, setSelectedSide] = useState<Side | undefined>(
    props.sides.find((side) => side.id === props.currentSideId)
  );

  useEffect(() => {
    const selectedSide = props.sides.find(
      (side) => side.id === props.currentSideId
    );
    if (selectedSide) {
      setSelectedSide(selectedSide);
    } else {
      setSelectedSide(undefined);
    }
  }, [props.sides, props.currentSideId]);

  const ellipsifySideName = (name: string, maxLength: number = 16) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  return (
    <Select
      id="side-select"
      value={selectedSide?.id ?? ""}
      onChange={(event: SelectChangeEvent<string>) => {
        if (event.target.value !== selectedSide?.id) {
          props.onSideSelect(event.target.value);
        }
      }}
      displayEmpty
      sx={{
        height: 35,
        minWidth: 250,
        borderRadius: 2,
        fontSize: 14,
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
        },
      }}
      renderValue={() =>
        selectedSide ? (
          <Box display="flex" alignItems="center" gap={1}>
            <EntityIcon
              type="circle"
              color={selectedSide.color}
              width={20}
              height={20}
            />
            <span>{ellipsifySideName(selectedSide.name, 24)}</span>
          </Box>
        ) : (
          <em>Select a side</em>
        )
      }
    >
      {props.sides.map((side) => (
        <MenuItem
          key={side.id}
          value={side.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center">
            <ListItemIcon sx={{ minWidth: 30 }}>
              <EntityIcon
                type="circle"
                color={side.color}
                width={20}
                height={20}
              />
            </ListItemIcon>
            <ListItemText primary={ellipsifySideName(side.name)} />
          </Box>
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              props.openSideEditor(side.id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </MenuItem>
      ))}

      {/* Divider and Add Side */}
      <Divider sx={{ my: 1 }} />
      <MenuItem value="add-side" onClick={() => props.openSideEditor(null)}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Add side" />
      </MenuItem>
    </Select>
  );
}
