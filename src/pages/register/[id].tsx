import { Card, CardContent } from "@mui/material";
import Link from "next/link";
import { ReactNode, useState } from "react";
import OtpInput from "react-otp-input";
import { Button } from "rsuite";
import AuthLayout from "src/layouts/auth-layout";
import UserIcon from "src/layouts/components/UserIcon";

const RegisterAccuracy = () => {
  const [otp, setOtp] = useState("");
  const handleChange = (code: any) => {
    setOtp(otp);
  };
  return (
    <div
      style={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
        marginTop: "119px",
      }}
    >
      <Card
        style={{
          margin: "auto",
          position: "relative",
        }}
      >
        <CardContent
          style={{
            paddingLeft: "50px",
            paddingRight: "50px",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Link href="/register/">
              <div
                style={{
                  position: "absolute",
                  left: 15,
                }}
              >
                <UserIcon
                  style={{ color: "#c72b22", marginTop: "3px" }}
                  icon="lucide:move-left"
                />
              </div>
            </Link>

            <div style={{ fontSize: "20px", fontWeight: "600" }}>
              Vui lòng nhập mã xác minh
            </div>
            <div
              style={{
                marginTop: "30px",
                lineHeight: "2",
              }}
            >
              <div>Mã xác thực đã được gửi qua Email</div>
              <div>tkseller@gmail.com</div>
            </div>
            <OtpInput
              inputType="number"
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputStyle={{
                marginTop: "30px",
                flex: "1 0 0",
                height: "80px",
                borderRadius: "7px",
                outline: "none",
                border: "1px solid #ccc",
                marginLeft: "8px",
                marginRight: "8px",
                background: "#fff",
                fontSize: "20px",
              }}
              renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} />}
            />
            <div
              style={{
                marginTop: "60px",
              }}
            >
              Bạn vẫn chưa nhận được ?
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "4px",
              }}
            >
              <div style={{ color: "#c72b22" }}>Gửi lại</div>
              <div>hoặc</div>
              <div style={{ color: "#c72b22" }}>
                thử bằng phương thức xác minh qua số điện thoại
              </div>
            </div>
            <Button
              style={{
                color: "#fff",
                backgroundColor: "#c72b22",
                marginTop: "30px",
                width: "100%",
                height: "50px",
                fontWeight: "600",
              }}
            >
              XÁC NHẬN
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

RegisterAccuracy.getLayout = (page: ReactNode) => (
  <AuthLayout>{page}</AuthLayout>
);
export default RegisterAccuracy;
