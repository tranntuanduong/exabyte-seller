import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import * as yup from "yup";
import UserIcon from "src/layouts/components/UserIcon";
import { Address } from "src/types/address";
import useUpdateShopAddress from "src/hooks/api/useUpdateShopAddress";
import ControlCheckbox from "src/components/form/ControlCheckbox";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import { useRouter } from "next/router";
import ControlAutocompleteSelect from "src/components/form/ControlAutocompleteSelect";
import { isActive } from "@tiptap/react";
import { LoadingButton } from "@mui/lab";

interface UpdateProps {
  idUpdate: string | undefined;
  openUpdate: boolean;
  onCloseUpdate?: () => void;

  addressSelected: Address | undefined;

  // addressSelected?: Address;

  fetchShopAddress?: () => void;
}

interface UpdateAddressForm {
  name: string;
  phone: string;
  ward: string;
  district: string;
  province: string;
  desc: string;
  isActive: boolean;
}

const schemaValidate = yup.object().shape({
  name: yup.string().required("Vui lòng nhập Họ và Tên").default(""),
  phone: yup
    .string()
    .required("Vui lòng nhập Số Điện Thoại ")
    .matches(
      /^(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Vui lòng nhập đúng số điện thoại"
    )
    .default(""),
  ward: yup.string().required("Vui lòng nhập Tỉnh/ Thành Phố ").default(""),
  district: yup.string().required("Vui lòng nhập Quận / Huyện").default(""),
  province: yup.string().required("Vui lòng nhập Phường / Xã").default(""),
  desc: yup.string().required("Vui lòng nhập Địa chỉ mặc định").default(""),
});

const EditAddressDialog = ({
  idUpdate,
  openUpdate,
  onCloseUpdate,
  addressSelected,
  fetchShopAddress,
}: UpdateProps) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm<UpdateAddressForm>({
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

  const [{ loading }, updateShopAddress] = useUpdateShopAddress(() => {
    if (fetchShopAddress) {
      fetchShopAddress();
    }
  });

  // check dia chi mac dinh sau khi update
  useEffect(() => {
    if (!addressSelected) return;
    reset({
      ...addressSelected,
      isActive: addressSelected.status === "ACTIVE" ? true : false,
    });
    setValue("district", addressSelected.district);
    setValue("ward", addressSelected.ward);
    console.log("addressSelected", addressSelected);
    handlePickProvince(addressSelected.province);
    handlePickDistrict(addressSelected.district);
  }, [addressSelected, openUpdate]);

  const onSubmit = async (data: UpdateAddressForm) => {
    const dataUpdate = {
      name: data.name,
      ward: data.ward,
      district: data.district,
      province: data.province,
      desc: data.desc,
      phone: data.phone,
      status: data.isActive ? "ACTIVE" : "INACTIVE",
    };
    if (idUpdate) {
      await updateShopAddress(dataUpdate, idUpdate);
      onCloseUpdate && onCloseUpdate();
      reset();
    }
    console.log("dataUpdate", dataUpdate);
  };

  //gioi han ku tu type number

  //cach 1
  // const [valuePhoneAddressUpdate, setvaluePhoneAddressUpdate] = useState("");
  // const handleChangeAddress = (e: any) => {
  //   const inputValue = e.target.value;
  //   const maxLength = 10;
  //   if (inputValue.length <= maxLength) {
  //     setvaluePhoneAddressUpdate(inputValue);
  //   }
  // };

  // cach 2

  const handleChangeAddress = (event: any) => {
    let inputValue = event.target.value.replace(/\D/g, "");
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }
    setValue("phone", inputValue);
  };

  console.log("asd123", getValues("district"), getValues("ward"));

  console.log("listDistrict", listDistrict);

  return (
    <Dialog
      open={openUpdate}
      onClose={onCloseUpdate}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            columnGap: "10px",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
              Cập nhật địa chỉ mới
            </Typography>

            <DialogContentText sx={{ mx: 2, mt: 2 }}>
              <ControlTextField
                inputProps={{ maxLength: 30 }}
                control={control}
                name="name"
                fullWidth
                label="Họ và tên"
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
                value={getValues("province")}
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
                value={getValues("district")}
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
                value={getValues("ward")}
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
                  disabled={addressSelected?.status === "ACTIVE"}
                />
              </Box>
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseUpdate} variant="outlined">
            Hủy
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={loading}
            loading={loading}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
        <Box
          sx={{ position: "absolute", padding: "15px", right: "0", top: "0" }}
        >
          <UserIcon onClick={onCloseUpdate} icon="mdi:close" />
        </Box>
      </form>
    </Dialog>
  );
};

export default EditAddressDialog;
