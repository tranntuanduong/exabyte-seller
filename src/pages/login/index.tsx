// ** React Imports
import { useState, ReactNode, MouseEvent } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Box, { BoxProps } from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Typography, { TypographyProps } from "@mui/material/Typography";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Hooks
import { useAuth } from "src/hooks/useAuth";
import useBgColor from "src/@core/hooks/useBgColor";
import { useSettings } from "src/@core/hooks/useSettings";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { Grid } from "@mui/material";
import ControlTextField from "src/components/form/ControlTextField";
import UserIcon from "src/layouts/components/UserIcon";
import { useRouter } from "next/router";
import AuthLayout from "src/layouts/auth-layout";

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10),
  },
}));

const LoginIllustration = styled("img")(({ theme }) => ({
  maxWidth: "48rem",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "35rem",
  },
}));

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("xl")]: {
    width: "100%",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 400,
  },
}));

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { mt: theme.spacing(8) },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
  })
);

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().min(5).required(),
});

const defaultValues = {
  password: "",
  email: "",
};

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  console.log("login");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // ** Hooks
  const auth = useAuth();
  const theme = useTheme();
  const bgColors = useBgColor();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  // ** Vars
  const { skin } = settings;

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onSubmit",
    defaultValues,
    mode: "onBlur",
    // resolver: yupResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    const { email, password } = data;
    auth.login({ email, password, rememberMe }, () => {
      // setError("email", {
      //   type: "manual",
      //   message: "Email or Password is invalid",
      // });
    });
  };

  console.log(":errors", errors);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : "auth-v2-login-illustration";

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
              <div className="form-title">Đăng nhập</div>

              {/* {auth.error && (
                <div className="error">
                  <div className="error-text">
                    *Email hoặc mật khẩu không chính xác.
                  </div>
                  <div className="error-text">Vui lòng nhập lại</div>
                </div>
              )} */}
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <ControlTextField
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
                  />
                </Grid>

                <Grid item xs={12}>
                  <ControlTextField
                    control={control}
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

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: "50px",
                        width: "100%",
                        margin: "auto",
                        marginTop: "30px",
                      }}
                      type="submit"
                    >
                      Đăng nhập
                    </Button>
                  </Grid>
                </Grid>

                <div
                  className="register-now"
                  onClick={() => router.push("/register")}
                >
                  Trở thành nhà bán hàng? <span>Đăng ký ngay!</span>
                </div>
              </Grid>
            </div>
          </div>
        </StyledContainer>
      </form>
    </StyledLogin>
  );
};

LoginPage.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

LoginPage.guestGuard = false;

export default LoginPage;

const StyledLogin = styled(Box)`
  .error {
    color: #c72b22;
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    background: #f6b3b44a;
    padding: 15px 10px;
    border-radius: 10px;
    width: 100%;
    margin-bottom: 20px;
  }

  .error-text {
    margin: auto;
    text-align: center;
  }

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
  padding: 0 20px;
`;
