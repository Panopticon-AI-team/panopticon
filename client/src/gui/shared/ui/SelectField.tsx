import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps as MUISelectProps,
  SxProps,
  Theme,
  OutlinedInput,
} from "@mui/material";

interface ISelectFieldProps extends Omit<MUISelectProps, "onChange" | "value"> {
  value: string | string[];
  selectItems: {
    name: string;
    value: string;
  }[];
  label: string;
  labelId: string;
  labelSx?: SxProps<Theme> | undefined;
  onChange: (value: string | string[]) => void;
}

const defaultSelectStyle = { borderRadius: 2, bgcolor: "#f5f5f5" };

export default function SelectField(props: ISelectFieldProps) {
  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    props.onChange(event.target.value);
  };

  return (
    <>
      <InputLabel sx={props.labelSx} id={props.labelId}>
        {props.label}
      </InputLabel>
      <Select
        id={props.id}
        labelId={props.labelId}
        value={props.value}
        label={props.label}
        onChange={(event) => handleChange(event)}
        multiple={props.multiple ?? false}
        sx={props.sx ?? defaultSelectStyle}
        displayEmpty={false}
        input={<OutlinedInput label={props.label} />}
        renderValue={(selected) => {
          // Map selected value items to their name
          const selectedValue = props.selectItems
            .filter((item) => selected.includes(item.value))
            .map((item) => item.name);

          return Array.isArray(selectedValue)
            ? selectedValue.join(", ")
            : selectedValue;
        }}
      >
        {props.selectItems.map((item: { name: string; value: string }) => (
          <MenuItem key={item.value} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
