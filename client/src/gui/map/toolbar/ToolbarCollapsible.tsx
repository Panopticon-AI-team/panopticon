import React, { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { colorPalette } from "@/utils/constants";
import { Typography } from "@mui/material";

interface ToolbarCollapsibleProps {
  title: string;
  content: React.JSX.Element;
  width: number;
  height: number;
  open: boolean;
}

export default function ToolbarCollapsible(
  props: Readonly<ToolbarCollapsibleProps>
) {
  const [open, setOpen] = useState(props.open);

  const cardHeaderStyle = {
    textAlign: "left",
    backgroundColor: colorPalette.white,
    color: "black",
    height: "5px",
    borderRadius: "10px",
  };

  const cardStyle = {
    minWidth: props.width,
    padding: "5px",
    backgroundColor: colorPalette.lightGray,
    boxShadow: "none",
  };
  const collapsibleStyle = {
    width: "100%",
    paddingLeft: "0px",
    marginLeft: "0px",
  };
  const collapsibleContainerStyle = {
    height: props.height,
  };

  return (
    <Card sx={cardStyle}>
      <CardHeader
        title={
          <Typography variant="body1" component="span">
            {props.title}
          </Typography>
        }
        avatar={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        sx={cardHeaderStyle}
        onClick={() => {
          setOpen(!open);
        }}
      ></CardHeader>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={collapsibleStyle}>
          <Container sx={collapsibleContainerStyle}>{props.content}</Container>
        </CardContent>
      </Collapse>
    </Card>
  );
}
