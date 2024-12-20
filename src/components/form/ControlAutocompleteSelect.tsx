import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Option extends FieldValues {
  id: any;
  [key: string]: any;
}

interface Label extends Option {
  name: string;
}

interface Props<T, O extends Option[]> extends Omit<TextFieldProps, "name"> {
  //@ts-ignore
  control: Control<T>;
  //@ts-ignore
  name: FieldPath<T>;
  options: O;
  selector: (option: O[number]) => string;
  onChangeSelect?: (id: any) => Promise<void> | void;
  getOptionDisabled?: (option: number) => boolean;
  placeholder: string;
  prerequisiteText?: string;
  dictation?: "column" | "row";
  hasLabel?: boolean;
}

const ControlAutocompleteSelect = <T extends FieldValues, O extends Option[]>(
  props: Props<T, O>
) => {
  const {
    control,
    name,
    options,
    selector,
    onChangeSelect,
    placeholder,
    disabled,
    prerequisiteText,
    getOptionDisabled,
    dictation = "column",
    hasLabel = true,
    label,
    value,
    ...rest
  } = props;

  const { t } = useTranslation();

  const labels = options.reduce<Record<number, Label>>((acc, option) => {
    const id = option.id;
    acc[id] = { id, name: selector(option) };
    return acc;
  }, {});

  console.log("options", options);

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "20px",
        flexDirection: dictation === "row" ? "row" : "column",
      }}
    >
      {hasLabel && (
        <Box
          sx={{
            mb: 2,
            width: dictation === "row" ? "200px" : "fit-content",
            textAlign: "right",
          }}
        >
          {label}
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Controller
          render={({ field: { value, ...others }, fieldState: { error } }) => (
            <Autocomplete
              id={name}
              disabled={disabled}
              {...(disabled && {
                forcePopupIcon: false,
              })}
              ListboxProps={{
                // Each item 36px + 16px padding Top, bottom
                style: { maxHeight: 36 * 5 + 16, overflowY: "auto" },
              }}
              options={options.map((option) => option.id)}
              getOptionLabel={(option) => labels[option].name}
              multiple={false}
              renderInput={(params) => (
                <TextField
                  error={Boolean(error)}
                  helperText={error?.message && t(error.message)}
                  placeholder={disabled ? void 0 : placeholder}
                  {...params}
                  {...rest}
                  size="small"
                  autoComplete="off"
                />
              )}
              renderOption={(props, option: number) => (
                <Box component="li" {...props} key={option}>
                  {labels[option].name}
                </Box>
              )}
              {...others}
              value={value in labels ? value : null}
              onChange={(_event, value: string | null) => {
                others.onChange(value);
                if (onChangeSelect && value) {
                  onChangeSelect(value);
                }
              }}
            />
          )}
          name={name}
          control={control}
        />
      </Box>
    </Box>
  );
};

export default ControlAutocompleteSelect;
