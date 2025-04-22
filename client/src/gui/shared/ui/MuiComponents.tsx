import {
  Menu as MuiMenu,
  MenuProps as MuiMenuProps,
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps,
} from "@mui/material";

export function Menu(props: MuiMenuProps) {
  return <MuiMenu {...props} />;
}

export function Popover(props: MuiPopoverProps) {
  return <MuiPopover {...props} />;
}
