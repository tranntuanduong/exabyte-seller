// ** React Imports
import { ReactNode, useState, Fragment, MouseEvent, useEffect } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box, { BoxProps } from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useAuth } from "src/hooks/useAuth";
import { useSettings } from "src/@core/hooks/useSettings";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { Grid } from "@mui/material";
import ControlTextField from "src/components/form/ControlTextField";
import UserIcon from "src/layouts/components/UserIcon";
import { useRouter } from "next/router";
import AuthLayout from "src/layouts/auth-layout";
import { RegisterParams } from "src/context/types";
import { AutoComplete } from "rsuite";
import { LoadingButton } from "@mui/lab";
import { IS_AFFILIATE } from "src/constants/env";

const schemaValidate = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập tên shop")
    .min(5, "Tên phải dài hơn 5 ký tự")
    .default(""),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Vui lòng nhập đúng email"
    )
    .default(""),
  phone: yup
    .string()
    .required("Vui lòng nhập Số Điện Thoại ")
    .matches(
      /^(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Vui lòng nhập đúng số điện thoại"
    )
    .default(""),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
      "Yêu cầu có chữ hoa, chữ thường, ký tự đặc biệt và số"
    )
    .default(""),
  link: yup
    .string()
    .required("Vui lòng nhập Link shop")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Link shop không được chứa các ký tự đặc biệt và khoảng trắng!"
    )
    .min(5, "Link shop phải lớn hơn 5 ký tự")
    .default(""),
  retypePassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .min(5, "Mật khẩu phải trùng khớp")
    .default("")
    .oneOf([yup.ref("password"), null], "Mật khẩu phải trùng khớp"),
});

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRetypePassword, setShowRetypePassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRegipePassword = () => setShowRetypePassword((i) => !i);
  // ** Hooks
  const theme = useTheme();
  const { register, loading } = useAuth();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  // ** Vars
  const { skin } = settings;

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterParams>({
    defaultValues: {
      ...schemaValidate.getDefault(),
    },
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  const onSubmit = (data: RegisterParams) => {
    // const { email, username, password } = data;
    register(data, (err) => {});
  };

  // xu li so dien thoai register

  const handleChange = (event: any) => {
    let inputValue = event.target.value.replace(/\D/g, "");
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }
    setValue("phone", inputValue);
  };

  //xac thuc qua sdt , email khi dang ky tai khoan

  const [openAccuracy, setopenAccuracy] = useState(false);

  const handleOpenAccuracy = () => {
    setopenAccuracy(true);
  };
  const handleCloseAccuracy = () => {
    setopenAccuracy(false);
  };

  return (
    <StyledLogin>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledContainer>
          <div className="login-content">
            {!hidden && (
              <div className="demo">
                <div className="demo-title">Bán hàng chuyên nghiệp</div>

                <div className="demo-desc">
                  Reference site about Lorem Ipsum, giving information on its
                  origins, as well as a random
                </div>

                <img
                  src="/images/pages/login.png"
                  alt=""
                  className="demo-img"
                  draggable={false}
                />
              </div>
            )}

            <div className="login-form">
              <div className="form-title">Trở thành nhà bán hàng</div>
              <div></div>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <ControlTextField
                    autoComplete="off"
                    control={control}
                    name="email"
                    fullWidth
                    label="Email"
                    ditaction="column"
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                      background: "#F5F5F5",
                      border: "none",
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <ControlTextField
                    autoComplete="off"
                    inputProps={{
                      maxLength: 30,
                    }}
                    control={control}
                    name="name"
                    fullWidth
                    label="Tên shop"
                    ditaction="column"
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                      background: "#F5F5F5",
                      border: "none",
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <ControlTextField
                    autoComplete="off"
                    control={control}
                    inputProps={{
                      maxLength: 30,
                    }}
                    name="password"
                    fullWidth
                    label="Mật khẩu"
                    ditaction="column"
                    type={showPassword ? "text" : "password"}
                    sx={{
                      background: "#F5F5F5",
                      border: "none",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
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

                <Grid item xs={6}>
                  <ControlTextField
                    autoComplete="off"
                    control={control}
                    inputProps={{
                      maxLength: 30,
                    }}
                    name="retypePassword"
                    fullWidth
                    label="Nhập lại mật khẩu"
                    ditaction="column"
                    type={showRetypePassword ? "text" : "password"}
                    sx={{
                      background: "#F5F5F5",
                      border: "none",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowRegipePassword}
                            edge="end"
                          >
                            {showRetypePassword ? (
                              <UserIcon icon="mdi:eye-outline" />
                            ) : (
                              <UserIcon icon="mdi:eye-off-outline" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <ControlTextField
                    autoComplete="off"
                    control={control}
                    onChange={handleChange}
                    inputProps={{
                      maxLength: 10,
                    }}
                    type="text"
                    name="phone"
                    fullWidth
                    label="Số điện thoại"
                    ditaction="column"
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                      background: "#F5F5F5",
                      border: "none",
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <ControlTextField
                    autoComplete="off"
                    inputProps={{
                      maxLength: 30,
                    }}
                    control={control}
                    name="link"
                    fullWidth
                    label="Tên thương hiệu"
                    ditaction="column"
                    sx={{
                      "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                      background: "#F5F5F5",
                      border: "none",
                    }}
                    // InputProps={{
                    //   endAdornment: <div>.giaohangtoan.com</div>,
                    // }}
                    required={!IS_AFFILIATE}
                  />
                </Grid>
                {!IS_AFFILIATE && (
                  <Grid item xs={12}>
                    <ControlTextField
                      autoComplete="off"
                      inputProps={{
                        maxLength: 30,
                      }}
                      control={control}
                      name="saleNumber"
                      fullWidth
                      label="Mã giới thiệu"
                      ditaction="column"
                      sx={{
                        "& .MuiOutlinedInput-root": { alignItems: "baseline" },
                        background: "#F5F5F5",
                        border: "none",
                      }}
                      placeholder="Ex: 0988xxx666"
                      // InputProps={{
                      //   endAdornment: <div>.giaohangtoan.com</div>,
                      // }}
                    />
                  </Grid>
                )}

                {/* <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "10px",
                  }}
                >
                  <div style={{ whiteSpace: "nowrap" }}>Xác thực qua :</div>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Email"
                        defaultChecked
                      />
                      <FormControlLabel
                        disabled={true}
                        value="male"
                        control={<Radio />}
                        label="Số điện thoại"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid> */}
                <Grid item xs={12}>
                  {/* <Link href="/register/id"> */}
                  <LoadingButton
                    onClick={handleOpenAccuracy}
                    // onClick={() => router.push(`/register/${registerAccuracy}`)}
                    variant="contained"
                    sx={{
                      borderRadius: "50px",
                      width: "100%",
                      margin: "auto",
                      marginTop: "30px",
                    }}
                    type="submit"
                    disabled={loading}
                    loading={loading}
                  >
                    Đăng ký
                  </LoadingButton>
                  {/* </Link> */}
                </Grid>

                <div
                  className="register-now"
                  onClick={() => router.push("/login")}
                >
                  Bạn đã có tài khoản? <span>Đăng nhập ngay!</span>
                </div>
              </Grid>
            </div>
          </div>
        </StyledContainer>
      </form>
    </StyledLogin>
  );
};

Register.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

// Register.guestGuard = true;

export default Register;

const StyledLogin = styled(Box)`
  .register-now {
    font-weight: 400;
    font-size: 16px;
    color: ${({ theme }) => theme.palette.grey[500]};
    width: 100%;
    margin: center;
    margin-top: 20px;
    text-align: center;

    span {
      font-weight: 500;
      color: ${({ theme }) => theme.palette.primary.main};
      cursor: pointer;
    }
  }

  .form-title {
    font-weight: 500;
    font-size: 36px;
    margin-bottom: 20px;
  }

  .demo-desc {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #666666;
    max-width: 380px;
    margin-top: 12px;
    margin-bottom: 70px;
  }

  .demo-title {
    font-size: 36px;
    line-height: 44px;
    text-align: center;
    color: #c72b22;
    font-weight: 500;
  }

  .login-content {
    color: #333;
    display: flex;
    column-gap: 20px;
    margin-top: 80px;
  }

  .demo {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-form {
    flex: 1;
    padding: 24px;
    background: #fff;
    box-shadow: 0px 11px 30px rgba(0, 0, 0, 0.05);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  color: #fff;
`;

const StyledContainer = styled(Box)`
  max-width: 1088px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
`;
