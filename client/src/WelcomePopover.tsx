import React from "react";
import {
  Popover,
  Box,
  Typography,
  Chip,
  Card,
  CardHeader,
  IconButton,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { colorPalette } from "@/utils/constants";
import LoginButton from "@/gui/map/toolbar/Login";

interface WelcomePopoverProps {
  open: boolean;
  onClose: () => void;
}

const closeButtonStyle = {
  bottom: 5.5,
};

const cardStyle = {
  backgroundColor: colorPalette.lightGray,
};

const cardHeaderStyle = {
  backgroundColor: colorPalette.white,
  color: "black",
  height: "24px",
};

const WelcomePopover: React.FC<WelcomePopoverProps> = ({ open, onClose }) => {
  const anchorPosition = {
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
  };

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      transformOrigin={{ vertical: "center", horizontal: "center" }}
      slotProps={{
        paper: { sx: { width: 750, maxWidth: "90vw", p: 0 } },
      }}
    >
      <Card sx={cardStyle}>
        <CardHeader
          sx={cardHeaderStyle}
          action={
            <IconButton
              type="button"
              sx={closeButtonStyle}
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon color="error" />
            </IconButton>
          }
        />
        <CardContent sx={{ display: "flex", minHeight: 300 }}>
          {/* LEFT SIDE */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRight: 1,
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome!
            </Typography>
            <Typography gutterBottom>
              Select "Build Scenario" or close this popup to start building
              scenarios. Log in to get access to features like more base map
              layers and saving scenarios to the cloud.
            </Typography>
            <Typography gutterBottom>
              All information on this system is Unclassified. Please do not add
              any classified or sensitive information into this system.
            </Typography>
          </Box>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Chip
              key={"build-scenario"}
              label={"Build Scenario"}
              clickable
              variant="outlined"
              sx={{ alignSelf: "stretch", py: 1 }}
              onClick={onClose}
            />
            <LoginButton />
          </Box>
        </CardContent>
      </Card>
    </Popover>
  );
};

export default WelcomePopover;
