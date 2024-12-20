import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { Box, FormHelperText, TextField, TextFieldProps } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface Props<T extends FieldValues> extends Omit<TextFieldProps, "name"> {
  label?: string;
  inputFormat?: string;
  control: Control<T>;
  name: FieldPath<T>;
  views?: Array<"day" | "month" | "year">;
}

const ControlDateField = <T extends FieldValues>({
  label,
  inputFormat = "DD/MM/YYYY",
  control,
  name,
  views,
  size = "small",
  ...rest
}: Props<T>) => {
  // const view = views || ['day', 'month', 'year']
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <DesktopDatePicker
          label={label}
          // @ts-ignore
          inputFormat={inputFormat}
          // @ts-ignore
          renderInput={(params) => (
            <TextField {...params} size={size} {...rest} fullWidth />
          )}
          dayOfWeekFormatter={(day) => `${day}`}
          {...field}
          {...(views && { views: views })}
        />
      )}
    />
  );
};

export default ControlDateField;
