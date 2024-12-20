import styled from "@emotion/styled";
import { Box } from "@mui/material";
//@ts-ignore
// import Cascader from "rc-cascader";
import { Cascader } from "rsuite";
import { ItemDataType } from "rsuite/esm/@types/common";
interface Props {
  options: any[];
  label?: string;
  required?: boolean;
  onSelect?: (
    value: ItemDataType,
    selectedPaths: ItemDataType[],
    event: React.SyntheticEvent
  ) => void;
  onChange?: (value: any, event: React.SyntheticEvent) => void;
  value?: any;
  direction?: "row" | "column";
  placeholder?: string;
}

const SCascarder = ({
  options,
  label,
  onSelect,
  direction = "row",
  onChange,
  required,
  value = [],
  placeholder = "Select",
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "20px",
        flexDirection: direction,
      }}
    >
      <Box
        sx={{
          mb: 2,
          width: "200px",
          textAlign: direction === "row" ? "right" : "left",
        }}
      >
        {label && (
          <Box
            component="span"
            sx={{
              height: "34px",
            }}
          >
            {label}
          </Box>
        )}

        {required && (
          <Box
            component="span"
            sx={{
              color: "red",
              opacity: "0.7",
            }}
          >
            *
          </Box>
        )}
      </Box>
      <StyledCascaderWrap>
        {/* <Cascader
          options={options}
          onChange={(value: any, selectedOptions: any[]) => {
            setInputValue(selectedOptions.map((o) => o.label).join(" > "));
            if (onSelect) {
              onSelect(value);
            }
          }}
        >
          <TextField
            placeholder="Chọn ngành hàng"
            size="small"
            fullWidth
            autoComplete="off"
            value={inputValue}
          />
        </Cascader> */}
        <Cascader
          data={options}
          block
          menuWidth={240}
          onSelect={onSelect}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
      </StyledCascaderWrap>
    </Box>
  );
};

export default SCascarder;

const StyledCascaderWrap = styled(Box)`
  flex: 1;
`;
