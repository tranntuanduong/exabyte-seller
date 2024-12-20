import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import UserIcon from "src/layouts/components/UserIcon";
import * as yup from "yup";

import { useEffect, useMemo } from "react";
import useUpdateWarehouse, {
  WareHouseForm,
} from "src/hooks/api/warehouse/useUpdateWarehouse";
import { Product } from "src/types/product";
import { Warehouse, WarehouseOption } from "src/types/warehouse";

interface Props {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  warehouse?: Warehouse;
  product?: Product;
  type?: "add" | "edit";
  wareHouseOptionsSelected?: WarehouseOption[];
}

const numberRegex = /^\d*\.?\d*$/;

const AddProductToWarehouseDialog = ({
  open,
  onClose,
  onSuccess,
  warehouse,
  product,
  type = "add",
  wareHouseOptionsSelected,
}: Props) => {
  const { data, updateWarehouse, loading } = useUpdateWarehouse({
    onSuccess: () => {
      onClose && onClose();
      onSuccess && onSuccess();
    },
  });

  const schemaValidate = useMemo(() => {
    let yupElement = {};
    if (product?.options?.length === 0) {
      yupElement = {
        stock: yup
          .string()
          .required("Vui lòng nhập số lượng tồn kho")
          .matches(numberRegex, "Tồn kho không hợp lệ"),
      };
    } else {
      yupElement = product?.options.reduce((acc: any, cur) => {
        acc[`${cur.id}`] = yup
          .string()
          .required("Vui lòng nhập số lượng tồn kho")
          .matches(numberRegex, "Tồn kho không hợp lệ");

        return acc;
      }, {});
    }

    return yup.object().shape(yupElement);
  }, [product]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  // reset form
  useEffect(() => {
    reset({});
  }, [product]);

  const onSubmit = async (formValues: any) => {
    if (product?.options?.length === 0) {
      const warehouseOption = wareHouseOptionsSelected?.[0];
      const data: WareHouseForm = {
        warehouseId: warehouse?.id,
        productId: product?.id,
        warehouseOptions: [
          {
            productOptionId: null,
            productStock: formValues.stock,
            id: warehouseOption?.id,
          },
        ],
      };
      updateWarehouse(data);
    } else {
      const data: WareHouseForm = {
        warehouseId: warehouse?.id,
        productId: product?.id,
        warehouseOptions: Object.keys(formValues).map((key) => {
          const warehouseOption = wareHouseOptionsSelected?.find(
            (_option) => _option.productOptionId === +key
          );
          return {
            productOptionId: +key,
            optionStock: formValues[key],
            id: warehouseOption?.id,
          };
        }),
      };
      updateWarehouse(data);
    }
  };

  useEffect(() => {
    if (!wareHouseOptionsSelected) return;

    const initValue = wareHouseOptionsSelected.reduce((acc: any, cur) => {
      if (cur.productOptionId) {
        acc[`${cur.productOptionId}`] = cur.optionStock;
      } else {
        acc[`stock`] = cur.productStock;
      }
      return acc;
    }, {});
    reset(initValue);
  }, [wareHouseOptionsSelected]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <form
        id={`form-warehouse-${product?.id}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent
          sx={{
            columnGap: "10px",
            alignItems: "center",
          }}
        >
          <Box>
            {type === "add" ? (
              <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
                Thêm sản phẩm vào kho ({warehouse?.name})
              </Typography>
            ) : (
              <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
                Chỉnh tồn kho ({warehouse?.name})
              </Typography>
            )}

            <DialogContentText sx={{ mx: 2, mt: 2 }}>
              {product?.options?.map((option) => (
                <Box
                  key={option.id}
                  sx={{
                    mt: 3,
                  }}
                >
                  <ControlTextField
                    control={control}
                    name={`${option.id}`}
                    fullWidth
                    label={`Phân loại ${option.name}`}
                    ditaction="column"
                    type="number"
                    placeholder={`Nhập số lượng cho phân loại ${option.name}`}
                  />
                </Box>
              ))}

              {product?.options.length === 0 && (
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <ControlTextField
                    control={control}
                    name={`stock`}
                    fullWidth
                    label={`Tồn kho`}
                    ditaction="column"
                    type="number"
                    placeholder={`Nhập số lượng cho sản phẩm`}
                    error={errors.stock ? true : false}
                  />
                </Box>
              )}
            </DialogContentText>
          </Box>
          <Box
            sx={{
              height: "100%",
              paddingTop: "40px",
            }}
          ></Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Hủy
          </Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Lưu
          </LoadingButton>
        </DialogActions>
        <Box
          sx={{
            position: "absolute",
            padding: "15px",
            right: "0",
            top: "0",
          }}
        >
          <UserIcon onClick={onClose} icon="mdi:close" />
        </Box>
      </form>
    </Dialog>
  );
};

export default AddProductToWarehouseDialog;
