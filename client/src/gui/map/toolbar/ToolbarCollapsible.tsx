import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import {
  Button,
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIconProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";
import DeselectCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import SelectCheckBoxIcon from "@mui/icons-material/CheckBox";
import { colorPalette } from "@/utils/constants";

interface ToolbarCollapsibleProps {
  title: string;
  content: React.JSX.Element;
  width?: number;
  height?: number;
  prependIcon?: React.ComponentType<SvgIconProps>;
  appendIcon?: React.ComponentType<SvgIconProps>;
  appendIconProps?: {
    tooltipProps?: {
      title: string;
      placement?:
        | "bottom-end"
        | "bottom-start"
        | "bottom"
        | "left-end"
        | "left-start"
        | "left"
        | "right-end"
        | "right-start"
        | "right"
        | "top-end"
        | "top-start"
        | "top";
      arrow?: boolean;
    };
    onClick: () => void;
  };
  enableFilter?: boolean;
  filterProps?: {
    options: { label: string; value: string }[];
    onApplyFilterOptions: (selectedOptions: string[]) => void;
  };
  open: boolean;
}

export default function ToolbarCollapsible(
  props: Readonly<ToolbarCollapsibleProps>
) {
  const PrependIcon = props.prependIcon;
  const AppendIcon = props.appendIcon;
  const filterOptions: { label: string; value: string }[] =
    props.filterProps?.options || [];
  const appendIconProps = props.appendIconProps;

  const [open, setOpen] = useState(props.open);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilterItems, setSelectedFilterItems] = useState<string[]>([
    ...filterOptions.map((option) => option.value),
  ]);
  const [tempSelectedFilterItems, setTempSelectedFilterItems] = useState<
    string[]
  >([]);

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setTempSelectedFilterItems([...selectedFilterItems]);
  };

  const handleCloseFilterMenu = () => {
    setAnchorEl(null);
    setTempSelectedFilterItems([...selectedFilterItems]);
  };

  const handleToggle = (value: string) => {
    setTempSelectedFilterItems((prevItems: string[]) =>
      prevItems.includes(value)
        ? prevItems.filter((item) => item !== value)
        : [...prevItems, value]
    );
  };

  const handleApply = () => {
    setSelectedFilterItems([...tempSelectedFilterItems]);
    props.filterProps?.onApplyFilterOptions([...tempSelectedFilterItems]);
    handleCloseFilterMenu();
  };

  const handleUnselectAll = () => {
    setTempSelectedFilterItems([]);
  };

  const handleSelectAll = () => {
    setTempSelectedFilterItems([
      ...filterOptions.map((option) => option.value),
    ]);
  };

  return (
    <>
      <ListItem
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        {/** Prepend Icon */}
        {PrependIcon && (
          <IconButton
            disableRipple
            sx={{ minWidth: "unset", p: 0, m: 0, mr: 1, cursor: "default" }}
          >
            <PrependIcon />
          </IconButton>
        )}
        <ListItemText primary={props.title} />
        {/** Append Icon */}
        {AppendIcon && (
          <Tooltip
            title={appendIconProps?.tooltipProps?.title}
            disableHoverListener={appendIconProps?.tooltipProps ? false : true}
            placement={appendIconProps?.tooltipProps?.placement || "bottom"}
            arrow={appendIconProps?.tooltipProps?.arrow || false}
          >
            <IconButton
              onClick={appendIconProps?.onClick}
              sx={{ minWidth: "unset", mr: 2, p: 0.5, m: 0 }}
            >
              <AppendIcon />
            </IconButton>
          </Tooltip>
        )}
        {/** Filter Menu/Button  */}
        {props.enableFilter && filterOptions.length && (
          <>
            <Tooltip title="Filter">
              <IconButton
                id="filter-button"
                aria-controls={anchorEl ? "filter-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? "true" : undefined}
                onClick={handleOpenFilterMenu}
                sx={{ minWidth: "unset", mr: 2, p: 0.5, m: 0 }}
              >
                <FilterAltIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseFilterMenu}
              slotProps={{
                root: { sx: { ".MuiList-root": { padding: 0 } } },
                list: {
                  "aria-labelledby": "filter-button",
                },
              }}
            >
              <Stack
                direction={"row"}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: colorPalette.lightGray,
                  pl: 0.2,
                  pt: 1,
                  pb: 1,
                }}
              >
                {/** Header: Select/Unselect All & Close Button */}
                {!tempSelectedFilterItems.length ? (
                  <Button
                    size="medium"
                    variant="text"
                    sx={{ alignItems: "end" }}
                    onClick={handleSelectAll}
                  >
                    <SelectCheckBoxIcon />
                    <Typography sx={{ ml: 1 }} variant="caption">
                      Select All
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    sx={{ alignItems: "end" }}
                    size="medium"
                    variant="text"
                    onClick={handleUnselectAll}
                  >
                    <DeselectCheckBoxIcon />
                    <Typography sx={{ ml: 1 }} variant="caption">
                      Unselect All
                    </Typography>
                  </Button>
                )}
                <IconButton onClick={handleCloseFilterMenu} sx={{ mr: 0.5 }}>
                  <ClearIcon sx={{ fontSize: 15, color: "red" }} />
                </IconButton>
              </Stack>
              {/** Menu Items */}
              {filterOptions.map((option: { label: string; value: string }) => (
                <MenuItem
                  sx={{ pl: 0 }}
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={tempSelectedFilterItems.includes(option.value)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
              {/* Apply Button */}
              <Button
                sx={{ borderRadius: 0 }}
                variant="contained"
                fullWidth
                onClick={handleApply}
              >
                Apply
              </Button>
            </Menu>
          </>
        )}
        {/** Toggle Show/Hide Dropdown */}
        <IconButton
          sx={{
            p: 0.5,
            m: 0,
            minWidth: "unset",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      {/** Collapse Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.content}
      </Collapse>
    </>
  );
}
