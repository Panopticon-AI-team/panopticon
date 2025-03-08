import {
  TextFieldProps as MUITextFieldProps,
  TextField as TextInputField,
} from "@mui/material";

interface ITextFieldProps extends Omit<MUITextFieldProps, "variant"> {
  id: string;
}

const defaultTextInputStyle = {
  mb: 2,
  borderRadius: 2,
  bgcolor: "#f5f5f5",
  "& .MuiOutlinedInput-root": { borderRadius: 2 },
};

export default function TextField(props: ITextFieldProps) {
  return <TextInputField {...props} sx={props.sx ?? defaultTextInputStyle} />;
}
