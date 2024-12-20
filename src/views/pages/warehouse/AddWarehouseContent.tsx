import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import * as yup from "yup";

import { Grid } from "@mui/material";
import ControlAutocompleteSelect from "src/components/form/ControlAutocompleteSelect";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import useAddWarehouse, {
  AddWarehouseParams,
} from "src/hooks/api/warehouse/useAddWarehouse";
import { useEffect } from "react";
import { Warehouse } from "src/types/warehouse";
import useUpdateWarehouseAddress from "src/hooks/api/warehouse/useUpdateWarehouseAddress";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập tên sản phẩm")
    .min(3, "Vui lòng nhập tên sản phẩm ít nhất 3 ký tự")
    .max(100, "Vui lòng nhập tên sản phẩm tối đa 100 ký tự"),
  phone: yup
    .string()
    .required("Vui lòng nhập Số Điện Thoại ")
    .matches(
      /^(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Vui lòng nhập đúng số điện thoại"
    )
    .default(""),
  provinceId: yup
    .string()
    .required("Vui lòng nhập Tỉnh/Thành Phố ")
    .default("")
    .nullable(),
  districtId: yup
    .string()
    .required("Vui lòng nhập Quận/Huyện")
    .default("")
    .nullable(),
  wardId: yup
    .string()
    .required("Vui lòng nhập Phường/Xã")
    .default("")
    .nullable(),
});

interface Props {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  warehouseSelected: Warehouse | null;
  buttonName?: string;
  hasToast?: boolean;
}

const AddWarehouseContent = ({
  onClose,
  open,
  warehouseSelected,
  onSuccess,
  buttonName = "LƯU",
  hasToast = true
}: Props) => {
  const {
    listProvince,
    handlePickDistrict,
    handlePickProvince,
    handlePickWard,
    listDistrict,
    listWard,
  } = usePickAddress();

  const { addWarehouse, data, loading } = useAddWarehouse({
    onSuccess,
    hasToast
  });

  const { updateWarehouseAddress, loading: updateWarehouseAddressLoading } =
    useUpdateWarehouseAddress({
      onSuccess,
    });
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    unregister,
    getValues,
  } = useForm<AddWarehouseParams>({
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: AddWarehouseParams) => {
    if (data.id) {
      updateWarehouseAddress(data);
    } else {
      addWarehouse(data);
    }
  };

  useEffect(() => {
    if (warehouseSelected) {
      handlePickProvince(warehouseSelected?.provinceId);
      handlePickDistrict(warehouseSelected?.districtId);
      reset({
        ...warehouseSelected,
      });
    } else {
      reset({});
    }
  }, [open, warehouseSelected]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container sx={{ mt: 5 }} spacing={4}>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="name"
            fullWidth
            label="Tên kho hàng"
            sx={{
              "& .MuiOutlinedInput-root": { alignItems: "baseline" },
            }}
            ditaction="column"
          />
        </Grid>

        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="phone"
            fullWidth
            label="Số điện thoại"
            sx={{
              "& .MuiOutlinedInput-root": { alignItems: "baseline" },
            }}
            ditaction="column"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlAutocompleteSelect
            control={control}
            name="provinceId"
            options={listProvince}
            selector={(option) => option.ten}
            placeholder="Tỉnh/Thành phố"
            label="Tỉnh/Thành phố"
            onChangeSelect={(id) => {
              handlePickProvince(id);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlAutocompleteSelect
            control={control}
            name="districtId"
            options={listDistrict}
            selector={(option) => option.ten}
            placeholder="Quận/Huyện"
            label="Quận/Huyện"
            onChangeSelect={(id) => {
              handlePickDistrict(id);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlAutocompleteSelect
            control={control}
            name="wardId"
            options={listWard}
            selector={(option) => option.ten}
            placeholder="Phường/Xã"
            label="Phường/Xã"
            onChangeSelect={(id) => {
              handlePickWard(id);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="addressDetail"
            fullWidth
            label="Mô tả địa chỉ"
            sx={{
              "& .MuiOutlinedInput-root": { alignItems: "baseline" },
            }}
            ditaction="column"
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 5,
          display: "flex",
          justifyContent: "flex-end",
          columnGap: "10px",
        }}
      >
        {onClose && (
          <Button onClick={onClose} variant="outlined">
            Đóng
          </Button>
        )}

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading || updateWarehouseAddressLoading}
        >
          {buttonName}
        </LoadingButton>
      </Box>
    </form>
  );
};

export default AddWarehouseContent;
