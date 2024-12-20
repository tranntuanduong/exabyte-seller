import styled from "@emotion/styled";
import { Box, Button, Grid } from "@mui/material";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormUnregister,
  UseFormWatch,
} from "react-hook-form";
import UserIcon from "src/layouts/components/UserIcon";
import ControlTextField from "../ControlTextField";
import FieldDetail from "./FieldDetail";
import FieldInfo from "./FieldInfo";
import useCustomFieldArray from "src/hooks/useCustomFieldArray";

interface Props {
  label?: string;
  control: Control<any>;
  watch: UseFormWatch<any>;
  name: string;
  desc: string;
  unregister: UseFormUnregister<any>;
  optionImages?: Record<string, File>;
  setOptionImages: Dispatch<SetStateAction<Record<string, File>>>;
  initUseClassify2?: boolean;
  isSeperateSize?: boolean;
  handleChangeSeperateSize?: (value: boolean) => void;
}

const ClassifyInput = ({
  label,
  control,
  watch,
  name,
  desc,
  unregister,
  optionImages,
  setOptionImages,
  initUseClassify2 = false,
  isSeperateSize = false,
  handleChangeSeperateSize,
}: Props) => {
  const [isUseClassify2, setIsUseClassify2] =
    useState<boolean>(initUseClassify2);

  const { controlledFields, remove } = useCustomFieldArray({
    watch,
    control,
    name,
  });

  const { controlledFields: controlledFields2, remove: remove2 } =
    useCustomFieldArray({
      watch,
      control,
      name: `${name}2`,
    });

  return (
    <Fragment>
      <FieldInfo
        desc={desc}
        name={name}
        watch={watch}
        control={control}
        label={label}
        controlledFields={controlledFields}
        controlledFields2={controlledFields2}
        remove={remove}
        remove2={remove2}
        isUseClassify2={isUseClassify2}
        handleChangeUseClassify2={setIsUseClassify2}
        unregister={unregister}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          marginBottom: "10px",
          marginTop: "40px",
          flexDirection: "column",
        }}
      >
        {isSeperateSize ? (
          <Button
            variant="outlined"
            onClick={() => {
              handleChangeSeperateSize && handleChangeSeperateSize(false);
            }}
          >
            Bỏ kích thước riêng
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => {
              handleChangeSeperateSize && handleChangeSeperateSize(true);
            }}
          >
            Dùng kích thước riêng
          </Button>
        )}
        {/* <Box
          sx={{
            color: "red",
            opacity: 0.7,
            fontSize: "13px",
            mt: 1,
            mb: 2,
          }}
        >
          Chú ý, cân nặng riêng sẽ ảnh hưởng đến phí vận chuyển.
        </Box> */}
      </Box>
      <FieldDetail
        controlledFields={controlledFields}
        controlledFields2={controlledFields2}
        watch={watch}
        name={name}
        desc={desc}
        control={control}
        isUseClassify2={isUseClassify2}
        optionImages={optionImages}
        setOptionImages={setOptionImages}
        isSeperateSize={isSeperateSize}
      />
    </Fragment>
  );
};

export default ClassifyInput;

const StyledFieldWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  column-gap: 20px;
  background-color: #f5f5f5;
  width: 100%;
  padding: 15px;

  & + & {
    margin-top: 20px;
  }
`;

const StyledFieldItem = styled(Box)`
  width: 100%;
  display: flex;
  column-gap: 10px;
  margin-top: 16px;
`;
