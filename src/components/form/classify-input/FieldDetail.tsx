import styled from "@emotion/styled";
import { Box, Button, Grid, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from "react";
import { Controller, UseFormWatch } from "react-hook-form";
import { stringArrToSlug } from "src/utils/string";
import SingleUploadImageField from "../SingleUploadImageField";
import * as yup from "yup";
import { Control, useForm } from "react-hook-form";

interface Props {
  controlledFields: any[];
  controlledFields2: any[];
  watch: UseFormWatch<any>;
  name: string;
  desc: string;
  control?: Control<any>;
  isUseClassify2: boolean;
  optionImages?: Record<string, File>;
  setOptionImages: Dispatch<SetStateAction<Record<string, File>>>;
  isSeperateSize: boolean;
}

const schemaValidate = yup.object().shape({});
const FieldDetail = ({
  controlledFields,
  controlledFields2,
  watch,
  control,
  name,
  desc,
  isUseClassify2,
  isSeperateSize,
  optionImages = {},
  setOptionImages,
}: Props) => {
  const [classifyDesc, classifyDesc2] = watch([`${desc}`, `${desc}2`]);
  const [_classify, _classify2] = watch([`${name}`, `${name}2`]) as [
    any[],
    any[]
  ];

  const classify = _classify?.filter((_item) => _item.name);
  const classify2 = _classify2?.filter((_item) => _item.name);

  console.log("isSeperateSize", isSeperateSize);

  // type text - textfield

  return (
    <Box sx={{}}>
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
          Danh sách phân loại hàng
        </Box>

        <Box
          sx={{
            flex: 1,
          }}
        >
          <StyledClassifyList>
            <div className="row">
              {classifyDesc && <div className="cell">{classifyDesc}</div>}
              {classifyDesc2 && <div className="cell">{classifyDesc2}</div>}
              <div className="cell">Giá</div>
              <div className="cell">Kho hàng</div>
              {isSeperateSize && <div className="cell">Khối lượng(g)</div>}
            </div>
            {classifyDesc &&
              classify?.map((_item, index) => (
                <div key={_item.name} className="row" style={{}}>
                  <div
                    className="cell"
                    style={{
                      height: `${classify2?.length ?? 0 * 80}px`,
                      minHeight: "150px",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "200px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box>{_item.name}</Box>
                      <SingleUploadImageField
                        isRounded={false}
                        label=""
                        size="80px"
                        hasLabel={false}
                        file={optionImages[stringArrToSlug([_item.name])]}
                        setFile={(file) =>
                          setOptionImages((prev) => ({
                            ...prev,
                            [stringArrToSlug([_item.name])]: file,
                          }))
                        }
                      />
                    </Box>
                  </div>
                  {classifyDesc2 && (
                    <div className="cell classify-item-wrap">
                      {classify2
                        ?.filter((_item2) => _item2.name)
                        ?.map((_item2, index2) => (
                          <div className="classify-item">{_item2.name}</div>
                        ))}
                    </div>
                  )}
                  {isUseClassify2 && (
                    <Fragment>
                      <div className="cell classify-item-wrap">
                        {classify2
                          ?.filter((_item2) => _item2.name)
                          ?.map((_item2, index2) => (
                            <div
                              key={`price-${index}-${index2}`}
                              className="classify-item"
                            >
                              <Controller
                                defaultValue=""
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    error={!!error}
                                    helperText={error ? error.message : ""}
                                  />
                                )}
                                name={stringArrToSlug(["price", index, index2])}
                                control={control}
                              />
                            </div>
                          ))}
                      </div>
                      <div className="cell classify-item-wrap">
                        {classify2
                          ?.filter((_item2) => _item2.name)
                          ?.map((_item2, index2) => (
                            <div
                              key={`inventory-${index}-${index2}`}
                              className="classify-item"
                            >
                              <Controller
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    error={!!error}
                                    helperText={error ? error.message : ""}
                                  />
                                )}
                                name={stringArrToSlug([
                                  "inventory",
                                  index,
                                  index2,
                                ])}
                                control={control}
                              />
                            </div>
                          ))}
                      </div>
                      {isSeperateSize && (
                        <div className="cell classify-item-wrap">
                          {classify2
                            ?.filter((_item2) => _item2.name)
                            ?.map((_item2, index2) => (
                              <div
                                key={`weight-${index}-${index2}`}
                                className="classify-item"
                              >
                                <Controller
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <TextField
                                      {...field}
                                      type="number"
                                      error={!!error}
                                      helperText={error ? error.message : ""}
                                    />
                                  )}
                                  name={stringArrToSlug([
                                    "weight",
                                    index,
                                    index2,
                                  ])}
                                  control={control}
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </Fragment>
                  )}
                  {!isUseClassify2 && (
                    <Fragment>
                      <div className="cell classify-item-wrap">
                        <Controller
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              type="number"
                              error={!!error}
                              helperText={error ? error.message : ""}
                            />
                          )}
                          name={stringArrToSlug(["price", index])}
                          control={control}
                        />
                      </div>
                      <div className="cell classify-item-wrap">
                        <Controller
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              type="number"
                              error={!!error}
                              helperText={error ? error.message : ""}
                            />
                          )}
                          name={stringArrToSlug(["inventory", index])}
                          control={control}
                        />
                      </div>
                      {isSeperateSize && (
                        <div className="cell classify-item-wrap">
                          <Controller
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                type="number"
                                error={!!error}
                                helperText={error ? error.message : ""}
                              />
                            )}
                            name={stringArrToSlug(["weight", index])}
                            control={control}
                          />
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
              ))}
          </StyledClassifyList>
        </Box>
      </Box>
    </Box>
  );
};

export default FieldDetail;

const StyledClassifyList = styled.div`
  width: 100%;
  border: 0.5px solid #ccc;

  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .row:first-child {
    border-bottom: none;
  }

  .cell {
    flex: 1;
    border: 0.5px solid #e0e0e0;
    padding: 12px;
    display: flex;
    justify-content: center;
  }

  .classify-item-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100px;
    justify-content: space-around;
  }

  .cell.classify-item-wrap {
    padding: 0 12px;
  }

  .classify-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
  }

  .classify-item::after {
    content: "";
    width: calc(100% + 24px);
    height: 1px;
    background: #e0e0e0;
    position: absolute;
    bottom: 0;
  }

  .classify-item:last-child::after {
    background: transparent;
  }

  input {
    width: 100%;
    padding: 8px;
    border: none;
    border: 1px solid #ccc;
    outline: none;
  }
`;

const StyledChild = styled("td")`
  padding: 0 !important;

  .table-cell + .table-cell {
    border-top: 1px solid #e0e0e0;
  }

  .table-cell {
    padding: 8px;
    display: flex;
    justify-content: center;
    flex: 1;
  }

  input {
    width: 80%;
    padding: 8px;
    border: none;
    border: 1px solid #ccc;
    outline: none;
  }
`;

const StyledCustomTableWrap = styled.div`
  display: flex;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid #e0e0e0;
    padding: 8px;
    height: 100%;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #f5f5f5;
    font-weight: 400;
    text-align: center;
  }
`;
