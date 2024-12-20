import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Grid, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ControlTextField from "src/components/form/ControlTextField";
import useChangePassword from "src/hooks/api/useChangePassword";
import UserIcon from "src/layouts/components/UserIcon";
import * as yup from "yup";
const schemaValidate = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Nhập mật khẩu hiện tại")

    .min(
      6,
      "Tối thiểu sáu ký tự, không có dấu cách, ít nhất một chữ cái và một số"
    )
    .max(30, "Mật khẩu chỉ được nhập tối đa 30 ký tự")

    // .matches(
    //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
    //   "Tối thiểu sáu ký tự, không có dấu cách, ít nhất một chữ cái và một số"
    // )
    .default(""),
  newPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu mới")
    .min(
      6,
      "Tối thiểu sáu ký tự, không có dấu cách, ít nhất một chữ cái và một số"
    )
    .max(30, "Mật khẩu chỉ được nhập tối đa 30 ký tự")

    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Tối thiểu sáu ký tự, không có dấu cách, ít nhất một chữ cái và một số"
    )
    .notOneOf([yup.ref("currentPassword"), null], "New password does not match")
    .default(""),
  retypeNewPasssword: yup
    .string()
    .required("Xác nhận mật khẩu mới")
    .min(
      6,
      "Tối thiểu sáu ký tự, không có dấu cách, ít nhất một chữ cái và một số"
    )
    .max(30, "Mật khẩu chỉ được nhập tối đa 30 ký tự")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Tối thiểu sáu ký tự, không có dấu cách, ít nhất một chữ cái và một số"
    )
    .default("")

    .oneOf([yup.ref("newPassword"), null], "mật khẩu phải trùng khớp"),
});
export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  retypeNewPasssword: string;
}

const ChangePasswordTab = () => {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });
  const { data: password, loading, handleChangePassword } = useChangePassword();
  console.log("data", password);
  const onSubmit = (data: ChangePasswordForm) => {
    handleChangePassword({
      newPassword: data.newPassword,
      oldPassword: data.currentPassword,
    });
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={5}
        sx={{
          maxWidth: 500,
        }}
      >
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="currentPassword"
            label="Mật khẩu hiện tại"
            ditaction="column"
            type={showPassword.password ? "text" : "password"}
            sx={{
              background: "#F5F5F5",
              border: "none",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        password: !showPassword.password,
                      })
                    }
                    edge="end"
                  >
                    {showPassword.password ? (
                      <UserIcon icon="mdi:eye-outline" />
                    ) : (
                      <UserIcon icon="mdi:eye-off-outline" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="newPassword"
            label="Mật khẩu mới"
            ditaction="column"
            type={showPassword.newPassword ? "text" : "password"}
            sx={{
              background: "#F5F5F5",
              border: "none",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        newPassword: !showPassword.newPassword,
                      })
                    }
                    edge="end"
                  >
                    {showPassword.newPassword ? (
                      <UserIcon icon="mdi:eye-outline" />
                    ) : (
                      <UserIcon icon="mdi:eye-off-outline" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="retypeNewPasssword"
            label="Xác nhận mật khẩu"
            ditaction="column"
            type={showPassword.confirmNewPassword ? "text" : "password"}
            sx={{
              background: "#F5F5F5",
              border: "none",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmNewPassword: !showPassword.confirmNewPassword,
                      })
                    }
                    edge="end"
                  >
                    {showPassword.confirmNewPassword ? (
                      <UserIcon icon="mdi:eye-outline" />
                    ) : (
                      <UserIcon icon="mdi:eye-off-outline" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} justifyItems="flex-end">
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={loading}
            loading={loading}
          >
            cập nhật mật khẩu
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};
export default ChangePasswordTab;
