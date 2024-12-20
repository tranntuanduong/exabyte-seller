import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from "@mui/material";
import { Control, Controller, FieldPath } from "react-hook-form";
interface Dictionary<T = any> {
  [key: string]: T;
}

interface Option extends Dictionary {
  id: number | string;
}

interface Label extends Option {
  name: string;
}
interface Props<O extends Option[]>
  extends Omit<SelectProps<number | string | null>, "name"> {
  options: O;
  selector?: (option: O[number]) => string;
  name: FieldPath<any>;
  title?: string;
  control: Control<any>;
  hasLabel?: boolean;
  direction?: "column" | "row";
}

const ControlSelect = <O extends Option[]>({
  name,
  control,
  size = "small",
  options,
  selector = (option) => option.label,
  hasLabel = true,
  direction = "row",
  ...rest
}: Props<O>) => {
  const labels = options.reduce<Record<string, Label>>((acc, option) => {
    const id = `${option.id}`;
    acc[id] = { id, name: selector(option) };
    return acc;
  }, {});

  return (
    <FormControl fullWidth>
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          flexDirection: direction === "row" ? "row" : "column",
        }}
      >
        {hasLabel && (
          <Box
            sx={{
              mb: 1,
              width: direction === "row" ? "200px" : "fit-content",
              textAlign: "right",
            }}
          >
            {rest.label ?? name}
          </Box>
        )}
      </Box>
      <Box sx={{ flex: 1, background: "#fff" }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error, ...restFieldState } }) => (
            <Box>
              <Select
                fullWidth
                size={size}
                input={<OutlinedInput />}
                inputProps={{ "aria-label": "Without label" }}
                {...field}
                {...rest}
                {...restFieldState}
              >
                {options.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {labels[option.id].name}
                  </MenuItem>
                ))}
              </Select>

              {error && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {error.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />
      </Box>
    </FormControl>
  );
};

export default ControlSelect;
