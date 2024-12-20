import styled from "@emotion/styled";
import { Box, Grid } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFieldArrayRemove,
  UseFormUnregister,
  UseFormWatch,
} from "react-hook-form";
import UserIcon from "src/layouts/components/UserIcon";
import { stringArrToSlug } from "src/utils/string";
import ControlTextField from "../ControlTextField";
import { StyledFieldItem, StyledFieldWrap } from "./styled";

interface Props {
  label?: string;
  control: Control<any>;
  watch: UseFormWatch<any>;
  name: string;
  desc: string;
  controlledFields: any[];
  controlledFields2: any[];
  remove: UseFieldArrayRemove;
  remove2: UseFieldArrayRemove;
  isUseClassify2: boolean;
  handleChangeUseClassify2: (value: boolean) => void;
  unregister: UseFormUnregister<any>;
}

const FieldInfo = ({
  label,
  control,
  watch,
  name,
  desc,
  controlledFields,
  controlledFields2,
  remove,
  remove2,
  isUseClassify2,
  handleChangeUseClassify2,
  unregister,
}: Props) => {
  const [_classify, _classify2] = watch([`${name}`, `${name}2`]) as [
    any[],
    any[]
  ];

  const handleRemoveField2 = (index: number, callback: UseFieldArrayRemove) => {
    if (isUseClassify2) {
      _classify.forEach((_item) => {
        unregister(
          stringArrToSlug(["inventory", _item.name, _classify2[index].name])
        );
        unregister(
          stringArrToSlug(["price", _item.name, _classify2[index].name])
        );
        unregister(
          stringArrToSlug(["weight", _item.name, _classify2[index].name])
        );
      });
    } else {
      _classify.forEach((_item) => {
        unregister(`inventory-${index}`);
        unregister(`price-${index}`);
        unregister(`weight-${index}`);
      });
    }

    callback(index);
  };

  const handleRemoveField = (index: number, callback: UseFieldArrayRemove) => {
    if (isUseClassify2) {
      _classify2.forEach((_item) => {
        unregister(
          stringArrToSlug(["inventory", _classify[index].name, _item.name])
        );
        unregister(
          stringArrToSlug(["price", _classify[index].name, _item.name])
        );
        unregister(
          stringArrToSlug(["weight", _classify[index].name, _item.name])
        );
      });
    } else {
      _classify.forEach((_item) => {
        unregister(`inventory-${index}`);
        unregister(`price-${index}`);
        unregister(`weight-${index}`);
      });
    }

    callback(index);
  };

  const handleDeleteClassify2 = () => {
    handleChangeUseClassify2(false);
    unregister(`${desc}2`);

    controlledFields.forEach((_item, index) => {
      controlledFields2.forEach((_item, index2) => {
        unregister(`${stringArrToSlug(["price", index, index2])}`);
        unregister(`${stringArrToSlug(["inventory", index, index2])}`);
        unregister(`${stringArrToSlug(["weight", index, index2])}`);

        remove2(index2);
      });
      unregister(`${stringArrToSlug(["price", index])}`);
      unregister(`${stringArrToSlug(["inventory", index])}`);
      unregister(`${stringArrToSlug(["weight", index])}`);
    });
  };

  const handleAddClassify2 = () => {
    handleChangeUseClassify2(true);
    controlledFields.forEach((_item, index) => {
      unregister(`${stringArrToSlug(["price", index])}`);
      unregister(`${stringArrToSlug(["inventory", index])}`);
      unregister(`${stringArrToSlug(["weight", index])}`);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "20px",
      }}
    >
      <Box
        sx={{
          mb: 2,
          width: "200px",
          textAlign: "right",
        }}
      >
        {label}
      </Box>

      <Box
        sx={{
          flex: 1,
        }}
      >
        <StyledFieldWrap>
          <StyledFieldItem>
            <Box
              sx={{
                fontSize: "14px",
                width: "150px",
              }}
            >
              Nhóm phân loại 1
            </Box>
            <Grid container>
              <Grid xs={6}>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <ControlTextField
                    name={desc}
                    placeholder="ví dụ: màu sắc, v.v"
                    control={control}
                    hasLabel={false}
                  />
                  <Box
                    sx={{
                      width: "41px",
                    }}
                  ></Box>
                </Box>
              </Grid>
            </Grid>{" "}
          </StyledFieldItem>
          <StyledFieldItem>
            <Box
              sx={{
                fontSize: "14px",
                width: "150px",
              }}
            >
              Phân loại hàng
            </Box>
            <Grid container spacing={4}>
              {controlledFields.map((item, index) => (
                <Grid item xs={6} key={item.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "5px",
                      color: "#d6d6d6",
                    }}
                  >
                    <ControlTextField
                      name={`${name}.${index}.name`}
                      placeholder="ví dụ: xanh, v.v"
                      control={control}
                      hasLabel={false}
                    />
                    {index < controlledFields.length - 1 ? (
                      <Box
                        onClick={() => {
                          handleRemoveField(index, remove);
                        }}
                        sx={{
                          "&:hover": {
                            color: "#616161",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <UserIcon icon="mdi:delete-outline" />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "26px",
                        }}
                      ></Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </StyledFieldItem>
        </StyledFieldWrap>
        {!isUseClassify2 && (
          <StyledFieldWrap>
            <Box
              sx={{
                display: "flex",
                columnGap: "16px",
              }}
            >
              <Box
                sx={{
                  fontSize: "14px",
                }}
              >
                Nhóm phân loại 2
              </Box>

              <Box
                sx={{
                  display: "flex",
                  border: "1px dashed #ccc",
                  px: 2,
                  py: 1.5,
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: (theme) => `${theme.palette.primary.main}}`,
                }}
                onClick={() => handleAddClassify2()}
              >
                <UserIcon icon="mdi:plus" />
                <Box>Thêm phân loại hàng</Box>
              </Box>
            </Box>
          </StyledFieldWrap>
        )}

        {isUseClassify2 && (
          <StyledFieldWrap>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  border: "1px dashed #ccc",
                  px: 2,
                  py: 1.5,
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: (theme) => `${theme.palette.primary.main}`,
                  width: "fit-content",
                }}
                onClick={() => handleDeleteClassify2()}
              >
                <UserIcon icon="mdi:plus" />
                <Box>Xóa</Box>
              </Box>

              <Box>
                <StyledFieldItem>
                  <Box
                    sx={{
                      fontSize: "14px",
                      width: "150px",
                    }}
                  >
                    Nhóm phân loại 2
                  </Box>
                  <Grid container>
                    <Grid xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <ControlTextField
                          name={`${desc}2`}
                          placeholder="ví dụ: Size, v.v"
                          control={control}
                          hasLabel={false}
                        />
                        <Box
                          sx={{
                            width: "41px",
                          }}
                        ></Box>
                      </Box>
                    </Grid>
                  </Grid>{" "}
                </StyledFieldItem>
                <StyledFieldItem>
                  <Box
                    sx={{
                      fontSize: "14px",
                      width: "150px",
                    }}
                  >
                    Phân loại hàng
                  </Box>
                  <Grid container spacing={4}>
                    {controlledFields2.map((item, index) => (
                      <Grid item xs={6} key={item.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "5px",
                            color: "#d6d6d6",
                          }}
                        >
                          <ControlTextField
                            name={`${name}2.${index}.name`}
                            placeholder="ví dụ: S, M, v.v"
                            control={control}
                            hasLabel={false}
                          />

                          {index <= controlledFields.length - 1 ? (
                            <Box
                              onClick={() => {
                                console.log("remove", index);
                                handleRemoveField2(index, remove2);
                              }}
                              sx={{
                                "&:hover": {
                                  color: "#616161",
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <UserIcon icon="mdi:delete-outline" />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                width: "26px",
                              }}
                            ></Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </StyledFieldItem>
              </Box>
            </Box>
          </StyledFieldWrap>
        )}
      </Box>
    </Box>
  );
};

export default FieldInfo;
