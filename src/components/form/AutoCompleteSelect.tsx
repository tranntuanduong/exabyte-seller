import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import UserIcon from "src/layouts/components/UserIcon";

interface Dictionary<T = any> {
  [key: string]: T;
}

interface Option extends Dictionary {
  id: number | string;
}

interface Label extends Option {
  name: string;
}

interface Props<O extends Option[]> {
  hasLabel?: boolean;
  direction?: "column" | "row";
  required?: boolean;
  minWidth?: string;
  label?: string;
  options: O;
  selector?: (option: O[number]) => string;
  onSelect?: (id: any) => void;
  value: any;
}

const AutoCompleteSelect = <O extends Option[]>({
  direction,
  hasLabel = true,
  minWidth,
  required,
  label,
  selector = (option) => option.label,
  onSelect = (option) => option,
  options,
  value,
}: Props<O>) => {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "20px",
        mt: 2,
        flexDirection: direction === "row" ? "row" : "column",
      }}
    >
      {hasLabel && (
        <Box
          sx={{
            mb: 2,
            width: direction === "row" ? "200px" : "fit-content",
            textAlign: "right",
          }}
        >
          {label}
        </Box>
      )}
      <Autocomplete
        disablePortal
        options={options}
        renderInput={(params) => {
          return (
            <TextField {...params} size="small" fullWidth placeholder={label} error={required && !value} helperText={`vui lòng chọn ${label}`}/>
          );
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            {selector(option)}
          </Box>
        )}
        getOptionLabel={(option) => {
          if (value) return selector(option);

          return "";
        }}
        onChange={(_event, option) => {
          if (option) {
            onSelect(option.id);
          }
        }}
        clearIcon={null}
      />
    </Box>
  );
};

export default AutoCompleteSelect;
