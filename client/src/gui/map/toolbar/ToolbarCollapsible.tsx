import React, { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/styles";
import { colorPalette } from "../../../utils/constants";

interface ToolbarCollapsibleProps {
  title: string;
  content: JSX.Element;
  width: number;
  height: number;
  open: boolean;
}

const useStyles = makeStyles({
  cardHeaderRoot: {
    textAlign: "left",
    backgroundColor: colorPalette.white,
    color: "black",
    height: "5px",
    borderRadius: "10px",
  },
});

export default function ToolbarCollapsible(
  props: Readonly<ToolbarCollapsibleProps>
) {
  const [open, setOpen] = useState(props.open);
  const classes = useStyles();

  const cardStyle = {
    minWidth: props.width,
    padding: "5px",
    backgroundColor: colorPalette.lightGray,
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
        title={props.title}
        avatar={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        classes={{
          root: classes.cardHeaderRoot,
        }}
        titleTypographyProps={{ variant: "body1" }}
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
