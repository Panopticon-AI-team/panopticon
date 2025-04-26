import React, { useState } from "react";
import {
  Popover,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Slider,
  Typography,
} from "@mui/material";

interface QuantitySliderProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  min: number;
  max: number;
  startValue: number;
  title?: string;
  handleCloseOnMap: () => void;
  handleConfirm: (value: number) => void;
}

const QuantitySlider: React.FC<QuantitySliderProps> = ({
  open,
  anchorEl,
  min,
  max,
  startValue,
  title,
  handleCloseOnMap,
  handleConfirm,
}) => {
  const [value, setValue] = useState<number>(startValue);

  const onConfirm = () => {
    handleConfirm(value);
    handleCloseOnMap();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleCloseOnMap}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "#282c34",
            p: 1,
          },
        },
      }}
    >
      <Card sx={{ bgcolor: "transparent", boxShadow: "none", minWidth: 260 }}>
        <CardHeader
          title={
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "white", textAlign: "center" }}
            >
              {title ?? "How many to launch?"}
            </Typography>
          }
        />

        <CardContent sx={{ px: 2, pt: 0, pb: 1 }}>
          <Slider
            value={value}
            onChange={(_, v) => setValue(v)}
            min={min}
            max={max}
            step={1}
            marks={[
              {
                value: min,
                label: (
                  <Typography component="div" sx={{ color: "white" }}>
                    {min.toString()}
                  </Typography>
                ),
              },
              {
                value: max,
                label: (
                  <Typography component="div" sx={{ color: "white" }}>
                    {max.toString()}
                  </Typography>
                ),
              },
            ]}
            valueLabelDisplay="auto"
          />
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="small"
            color="error"
            onClick={handleCloseOnMap}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </Popover>
  );
};

export default QuantitySlider;
