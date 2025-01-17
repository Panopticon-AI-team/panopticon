import { makeStyles } from "@mui/styles";
import React from "react";

interface EditorSelectorProps {
  selectId: string;
  caption: string;
  optionIds: string[];
  optionNames: string[];
  selectedOption: string | string[];
  onChange: (option: string) => void;
  multiple?: boolean;
}

const useStyles = makeStyles({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  caption: {
    marginRight: "15px",
  },
  selector: {
    width: "100%",
  },
});

const EditorSelector = (props: EditorSelectorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <span className={classes.caption}>{props.caption}</span>
      <select
        id={props.selectId}
        title={props.caption}
        value={props.selectedOption}
        onChange={(event) => props.onChange(event.target.value)}
        multiple={props.multiple ?? false}
        className={classes.selector}
      >
        {props.optionIds.map((optionId, index) => (
          <option key={optionId} value={optionId}>
            {props.optionNames[index]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EditorSelector;
