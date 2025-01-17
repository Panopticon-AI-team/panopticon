import { makeStyles } from "@mui/styles";
import React from "react";

interface EditorTextInputBoxProps {
  caption: string;
  currentText: string;
  onChange: (option: string) => void;
}

const useStyles = makeStyles({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  caption: {
    marginRight: "10px",
  },
});

const EditorTextInputBox = (props: EditorTextInputBoxProps) => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <span className={classes.caption}>{props.caption}</span>
      <input
        type="text"
        value={props.currentText}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  );
};

export default EditorTextInputBox;
