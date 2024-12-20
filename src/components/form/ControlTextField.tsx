import { Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Fragment } from "react";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface Props extends Omit<TextFieldProps, "name"> {
  // @ts-ignore
  control: Control<any>;
  // @ts-ignore
  name: FieldPath<T>;
  hasLabel?: boolean;
  ditaction?: "column" | "row";
  required?: boolean;
  minWidth?: string;
  [key: string]: any;
}
const ControlTextField = <T extends FieldValues>({
  control,
  name,
  hasLabel = true,
  ditaction = "row",
  required,
  minWidth,
  ...rest
}: Props) => {
  const placeholder = rest.placeholder ?? (rest.label as string);
  return (
    <FormControl fullWidth>
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          flexDirection: ditaction === "row" ? "row" : "column",
        }}
      >
        {hasLabel && (
          <Box
            sx={{
              width: ditaction === "row" ? "200px" : "fit-content",
              textAlign: "right",
              height: "fit-content",
              minHeight: "30px",
              minWidth: "max-content",
            }}
          >
            {rest.label ?? name}
            {required && (
              <Box
                component={"span"}
                sx={{
                  color: "red",
                  opacity: "0.7",
                }}
              >
                *
              </Box>
            )}
          </Box>
        )}
        <Box sx={{ flex: 1, background: "#fff" }}>
          <Controller
            name={name}
            control={control}
            // rules={{ required: true }}
            render={({ field, fieldState: { error } }) => {
              return (
                <Fragment>
                  <TextField
                    id={name}
                    size="small"
                    error={Boolean(error)}
                    aria-describedby="validation-basic-first-name"
                    {...field}
                    {...rest}
                    label=""
                    fullWidth
                    placeholder={placeholder}
                    autoComplete="off"
                    inputProps={{
                      autocomplete: "delete-fill-data",
                      form: {
                        autocomplete: "off",
                      },
                    }}
                  />
                  {error && (
                    <FormHelperText
                      sx={{ color: "error.main" }}
                      id="validation-basic-first-name"
                    >
                      {error.message}
                    </FormHelperText>
                  )}
                </Fragment>
              );
            }}
          />
        </Box>
      </Box>
    </FormControl>
  );
};

export default ControlTextField;
