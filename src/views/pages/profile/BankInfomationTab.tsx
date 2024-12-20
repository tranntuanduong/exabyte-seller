import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ControlTextField from "src/components/form/ControlTextField";
import useFetchProfile from "src/hooks/api/useFetchProfile";
import useUpdateProfile from "src/hooks/api/shop/useUpdateProfile";
import * as yup from "yup";
import { useAuth } from "src/hooks/useAuth";
import SingleUploadImageField from "src/components/form/SingleUploadImageField";
import FileDropZone from "src/components/DropZone/FileDropZone";
// import useUploadImage from "src/hooks/api/upload/useUploadImage";
import { IMAGE_BASE_URL } from "src/constants/aws";
import useUploadImage from "src/hooks/api/upload/useUploadImage";
import { DEFAULT_USER_IMAGE } from "src/constants/image";
import MutipleUploadImage, {
  PreviewImgs,
} from "src/components/form/MutipleUploadImage";

import { toast } from "react-hot-toast";
import useFetchShopBusiness from "src/hooks/api/shop/useFetchShopBusiness";
import useAddBusinessImagesShop from "src/hooks/api/shop/useAddBussinessImagesShop";
import { UpdateBusiness } from "src/types/shop.type";
import { getImageCheck } from "src/utils/image";
import ControlSelect from "src/components/form/ControlSelect";
import useFetchBanksGhtq from "src/hooks/api/useFetchBankId";
import { randomPassword } from "src/utils/random";
import useUpdateBankInfo from "src/hooks/api/useUpdateBankInfo";
import ControlAutocompleteSelect from "src/components/form/ControlAutocompleteSelect";

const schemaValidate = yup.object().shape({
  bankId: yup.string().required("Vui lòng chọn ngân hàng").default(""),
  bankNumber: yup.string().required("Vui lòng nhập số tài khoản").default(""),
  fullName: yup.string().required("Vui lòng nhập họ và tên").default(""),
  bankBranch: yup
    .string()
    .required("Vui lòng nhập chi nhánh ngân hàng")
    .default(""),
  email: yup.string().required("Vui lòng nhập email").default(""),
  phone: yup.string().required("Vui lòng nhập số điện thoại").default(""),
});

export interface UpdateProfileForm {
  bankId: string;
  bankNumber: string;
  fullName: string;
  bankBranch: string;
  phone: string;
  email: string;
}

interface Props {
  buttonName?: string;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}

const BankInfomationTab = ({ buttonName = "LƯU", onSuccess, onError }: Props) => {
  const { user, fetchShopProfile } = useAuth();

  const { data, loading, update } = useUpdateBankInfo({
    onSuccess: () => {
      fetchShopProfile();
      onSuccess && onSuccess();
    },
    onError
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileForm>({
    defaultValues: schemaValidate.getDefault(),
    resolver: yupResolver(schemaValidate),
  });

  const { data: banks } = useFetchBanksGhtq();

  console.log("user", user);

  useEffect(() => {
    if (!user?.shopBankAccount) return;

    reset({
      ...user.shopBankAccount,

      bankNumber: user.shopBankAccount.accountNumber,
      bankId: user.shopBankAccount.bankId,
    });

    setValue("bankId", user.shopBankAccount.bankId);
  }, [user, banks]);

  const onSubmit = async (data: UpdateProfileForm) => {
    if (!user.phone) {
      toast.error("Vui lòng cập nhật thông tin cơ bản trước");
      return;
    }

    const namePaths = data.fullName.toLocaleUpperCase().split(" ");

    const lastName = namePaths.pop();
    const firstName = namePaths.join(" ");

    const password = randomPassword();

    update({
      first_name: firstName,
      last_name: lastName,
      phone: data.phone,
      email: data.email,
      password: password,
      confirm_password: password,
      bank_id: data.bankId,
      bank_branch: data.bankBranch,
      bank_account_number: data.bankNumber,
      bank_account_name: data.fullName,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <ControlAutocompleteSelect
            control={control}
            name="bankId"
            options={banks}
            selector={(option) => option.name}
            label="Ngân hàng"
            placeholder="Ngân hàng"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="bankNumber"
            fullWidth
            label="Số tài khoản"
            ditaction="column"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="fullName"
            fullWidth
            label="Họ và tên"
            ditaction="column"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="bankBranch"
            fullWidth
            label="Chi nhánh ngân hàng"
            ditaction="column"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="email"
            fullWidth
            label="Email"
            ditaction="column"
            disabled={user?.shopBankAccount}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="phone"
            fullWidth
            label="Số điện thoại"
            ditaction="column"
            disabled={user?.shopBankAccount}
          />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <LoadingButton
              variant="contained"
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {buttonName}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default BankInfomationTab;
