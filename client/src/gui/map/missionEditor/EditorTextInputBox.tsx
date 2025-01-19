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

// Props
interface EditorTextInputBoxProps {
  caption: string;
  currentText: string;
  onChange: (option: string) => void;
}

const EditorTextInputBox = (props: EditorTextInputBoxProps) => {
  return (
    <Row>
      <Caption>{props.caption}</Caption>
      <input
        type="text"
        value={props.currentText}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </Row>
  );
};

export default EditorTextInputBox;
