import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface Props<T extends FieldValues> {
  control: Control<any>;
  name: FieldPath<T>;
  label?: string;
  disabled?: boolean;
}

const ControlCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: Props<T>) => {
  return (
    <FormControlLabel
      sx={{
        userSelect: "none",
      }}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Box>
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={disabled}
                />
              </Box>
            );
          }}
        />
      }
      label={label}
    />
  );
};

export default ControlCheckbox;
