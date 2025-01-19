import { styled } from "@mui/system";

// Styled components
const Row = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const Caption = styled("span")({
  marginRight: "15px",
});

const Selector = styled("select")({
  width: "100%",
});

// Props
interface EditorSelectorProps {
  selectId: string;
  caption: string;
  optionIds: string[];
  optionNames: string[];
  selectedOption: string | string[];
  onChange: (option: string) => void;
  multiple?: boolean;
}

const EditorSelector = (props: EditorSelectorProps) => {
  return (
    <Row>
      <Caption>{props.caption}</Caption>
      <Selector
        id={props.selectId}
        title={props.caption}
        value={props.selectedOption}
        onChange={(event) => props.onChange(event.target.value)}
        multiple={props.multiple ?? false}
      >
        {props.optionIds.map((optionId, index) => (
          <option key={optionId} value={optionId}>
            {props.optionNames[index]}
          </option>
        ))}
      </Selector>
    </Row>
  );
};

export default EditorSelector;
