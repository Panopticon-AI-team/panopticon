import React, { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import { colorPalette } from "../../../utils/constants";

interface CollapsibleCardProps {
  title: string;
  content: JSX.Element;
  width: number;
  height: number;
  expandParent?: (expanded: boolean) => void;
  open: boolean;
}

export default function CollapsibleCard(props: Readonly<CollapsibleCardProps>) {
  const [open, setOpen] = useState(props.open);
  return (
    <Card
      sx={{
        minWidth: props.width,
        padding: "5px",
        backgroundColor: colorPalette.lightGray,
      }}
    >
      <CardHeader
        title={props.title}
        action={
          <IconButton
            onClick={() => {
              setOpen(!open);
              if (props.expandParent) props.expandParent(!open);
            }}
            aria-label="expand"
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        }
        sx={{
          textAlign: "left",
          backgroundColor: colorPalette.white,
          color: "black",
          height: "15px",
          borderRadius: "10px",
          alignItems: "center",
        }}
        titleTypographyProps={{ variant: "body1" }}
      ></CardHeader>
      <div
        style={{
          backgroundColor: colorPalette.lightGray,
        }}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              width: "100%",
              paddingLeft: "0px",
              marginLeft: "0px",
            }}
          >
            <Container
              sx={{
                height: props.height,
              }}
            >
              {props.content}
            </Container>
          </CardContent>
        </Collapse>
      </div>
    </Card>
  );
}
