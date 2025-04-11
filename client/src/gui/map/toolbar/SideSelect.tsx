import Side from "@/game/Side";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";
import EntityIcon from "./EntityIcon";
import EditIcon from "@mui/icons-material/Edit";

interface SideSelectProps {
  sides: Side[];
  currentSideId: string;
  onSideSelect: (sideId: string) => void;
}

export default function SideSelect(props: Readonly<SideSelectProps>) {
  const selectedSide = props.sides.find(
    (side) => side.id === props.currentSideId
  );

  return (
    <Select
      value={props.currentSideId}
      onChange={(event: SelectChangeEvent<string>) =>
        props.onSideSelect(event.target.value)
      }
      displayEmpty
      sx={{
        height: 35,
        minWidth: 180,
        // backgroundColor: "#fff",
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
            <span>{selectedSide.name}</span>
            {/* <IconButton onClick={() => {}}>
              <EditIcon />
            </IconButton> */}
          </Box>
        ) : (
          <em>Select a side</em>
        )
      }
    >
      {props.sides.map((side) => (
        <MenuItem key={side.id} value={side.id}>
          <ListItemIcon sx={{ minWidth: 30 }}>
            <EntityIcon
              type="circle"
              color={side.color}
              width={20}
              height={20}
            />
          </ListItemIcon>
          <ListItemText primary={side.name} />
        </MenuItem>
      ))}
    </Select>
  );
}
