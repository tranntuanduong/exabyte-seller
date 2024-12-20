import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import UserIcon from "src/layouts/components/UserIcon";
import * as yup from "yup";
import useCreateShopAddress from "src/hooks/api/useCreateShopAddress";
import { useEffect, useState } from "react";
import ControlCheckbox from "src/components/form/ControlCheckbox";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import ControlAutocompleteSelect from "src/components/form/ControlAutocompleteSelect";
import { AddressShopData } from "src/hooks/api/useFetchShopAddress";
import { useRouter } from "next/router";

interface Props {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}
interface AddAddressForm {
  name: string;
  phone: string;
  ward: string | null;
  district: string | null;
  province: string | null;
  desc: string;
  isActive: string;
}

const schemaValidate = yup.object().shape({
  name: yup
    .string()
    .min(5, "Tên phải dài hơn 5 ký tự")
    .required("Vui lòng nhập Họ và tên")
    .default(""),
  phone: yup
    .string()
    .required("Vui lòng nhập Số Điện Thoại ")
    .matches(
      /^(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Vui lòng nhập đúng số điện thoại"
    )
    .default(""),
  province: yup
    .string()
    .required("Vui lòng nhập Tỉnh/Thành Phố ")
    .default("")
    .nullable(),
  district: yup
    .string()
    .required("Vui lòng nhập Quận/Huyện")
    .default("")
    .nullable(),
  ward: yup.string().required("Vui lòng nhập Phường/Xã").default("").nullable(),
  desc: yup.string().required("Vui lòng nhập Địa chỉ mặc định").default(""),
});

const AddAddressDialog = ({ open, onClose, onSuccess }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,

    // getInputProps,
    reset,
    getValues,
  } = useForm<AddAddressForm>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  const {
    listProvince,
    handlePickDistrict,
    handlePickProvince,
    handlePickWard,
    listDistrict,
    listWard,
  } = usePickAddress();

  const [{ data, loading }, createShopAddress] = useCreateShopAddress(() => {
    onSuccess && onSuccess();
  });

  const onSubmit = async (data: AddressShopData) => {
    let newData: AddressShopData = {
      name: data.name,
      ward: data.ward,
      district: data.district,
      province: data.province,
      desc: data.desc,
      phone: data.phone,
      status: data.isActive ? "ACTIVE" : "INACTIVE",
    };
    await createShopAddress(newData);
    onClose && onClose();
    reset();
  };

  //xu ly sdt type text chi cho nhap so , gioi han 10 so

  const handleChangeAddress = (event: any) => {
    let inputValue = event.target.value.replace(/\D/g, "");
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }
    setValue("phone", inputValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <form id="formAddress" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            columnGap: "10px",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
              Thêm địa chỉ mới
            </Typography>

            <DialogContentText sx={{ mx: 2, mt: 2 }}>
              <ControlTextField
                inputProps={{ maxLength: 30 }}
                control={control}
                name="name"
                fullWidth
                label="Tên kho"
                ditaction="column"
              />
              <Box sx={{ mt: 2 }}>
                <ControlTextField
                  control={control}
                  name="phone"
                  fullWidth
                  label="Số điện thoại"
                  ditaction="column"
                  type="text"
                  onChange={handleChangeAddress}
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              </Box>
              <ControlAutocompleteSelect
                control={control}
                name="province"
                options={listProvince}
                selector={(option) => option.ten}
                placeholder="Tỉnh/Thành phố"
                label="Tỉnh/Thành phố"
                onChangeSelect={(id) => {
                  handlePickProvince(id);
                }}
              />
              <ControlAutocompleteSelect
                control={control}
                name="district"
                options={listDistrict}
                selector={(option) => option.ten}
                placeholder="Quận/Huyện"
                label="Quận/Huyện"
                onChangeSelect={(id) => {
                  handlePickDistrict(id);
                }}
              />
              <ControlAutocompleteSelect
                control={control}
                name="ward"
                options={listWard}
                selector={(option) => option.ten}
                placeholder="Phường/Xã"
                label="Phường/Xã"
                onChangeSelect={(id) => {
                  handlePickWard(id);
                }}
              />

              <Box sx={{ mt: 2 }}>
                <ControlTextField
                  inputProps={{ maxLength: 30 }}
                  control={control}
                  name="desc"
                  fullWidth
                  label="Địa chỉ chi tiết"
                  ditaction="column"
                />
              </Box>
              <Box
                sx={{
                  paddingTop: "20px",
                }}
              >
                <ControlCheckbox
                  control={control}
                  name="isActive"
                  label="Đặt làm địa chỉ mặc định"
                />
              </Box>
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Hủy
          </Button>
          <LoadingButton
            loading={loading}
            disabled={loading}
            type="submit"
            variant="contained"
          >
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

export default AddAddressDialog;
