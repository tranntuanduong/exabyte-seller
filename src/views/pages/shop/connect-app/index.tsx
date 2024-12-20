import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ControlTextField from "src/components/form/ControlTextField";
import useConnectKiotviet from "src/hooks/api/shop/useConnectKiotviet";
import { getProductKiot } from "src/services";

import * as yup from "yup";
import ListProdConnect from "./ListProdConnect";
import axios from "axios";
import { useRouter } from "next/router";
interface DataForm {
  address: string;
  clientId: string;
  secret: string;
}

const schemaValidate = yup.object().shape({
  // desc: yup.string().required("Vui lòng nhập Địa chỉ mặc định").default(""),
  address: yup.string().required("Không được bỏ trống trường này").default(""),
  clientId: yup.string().required("Không được bỏ trống trường này").default(""),
  secret: yup.string().required("Không được bỏ trống trường này").default(""),
});

const minW = "197px";
const steps = ["Kết nối app", "Đồng bộ sản phẩm"];
const ConnectAppContent = () => {
  const { query } = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DataForm>({
    defaultValues: schemaValidate.getDefault(),
    mode: "onSubmit",
    resolver: yupResolver(schemaValidate),
  });

  useEffect(() => {}, []);

  const [{}, handleConnect] = useConnectKiotviet();

  const [stepValue, setStepValue] = useState(0);

  const onSubmit = async (data: DataForm) => {
    const dataConnect = {
      scopes: "PublicApi.Access",
      grant_type: "client_credentials",
      client_id: data.clientId,
      client_secret: data.secret,
      address: data.address,
    };
    await handleConnect(dataConnect);
    handleNext();
  };

  const handleNext = () => {
    setStepValue((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setStepValue((prevActiveStep) => prevActiveStep - 1);
  };

  // useEffect(() => {
  //   if (stepValue === 1) {
  //     getProductKiot();
  //   }
  // }, [stepValue]);

  useEffect(() => {
    // reset({
    //   address: "duongshop1998",
    //   clientId: "a9d05d87-9ea9-4e44-88e3-56a5e2fbe41e",
    //   secret: "9121606EB7B188541EAEFA03271A346B0619FC35",
    // });
  }, []);
  return (
    <div>
      {/* <div
        onClick={() => {
          window.open(
            "https://phuoc-1.mysapo.net/admin/oauth/authorize?client_id=d71866a856d446f7ad026e0eadadb686&scope=read_products&redirect_uri=http://localhost:3000/shop/connect-app/"
          );
        }}
      >
        CONNEEECCCCCC
      </div>

      <div
        onClick={() => {
          console.log("query",query)
          axios.post(`http://localhost:3211/api/sapo/accesstoken`, {
            client_id: "d71866a856d446f7ad026e0eadadb686",
            client_secret: "1e8d41c2a21748508689ca11eb457fca",
            code: query.code,
            store: query.store,
          });
        }}
      >
        GET token
      </div> */}
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={stepValue} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <div>
        <h3
          style={{
            margin: "20px 0px",
          }}
        >
          Đồng bộ sản phẩm từ các app bán hàng về sàn
        </h3>
        <Card>
          <CardContent>
            {stepValue === 0 && (
              <div>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "10px",
                  }}
                >
                  <p>App bán hàng</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid red",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "100%",
                        marginRight: "4px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "red",
                          width: "8px",
                          height: "8px",
                          borderRadius: "100%",
                        }}
                      />
                    </div>
                    Kiot viet
                  </div>
                </Box>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "16px",
                    marginTop: "20px",
                  }}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    <ControlTextField
                      style={{}}
                      control={control}
                      name="address"
                      placeholder="Nhập địa chỉ truy cập cửa hàng"
                      fullWidth
                      label="Địa chỉ truy cập cửa hàng"
                      ditaction="row"
                    />
                    <p
                      style={{
                        margin: 0,
                      }}
                    >
                      kiotviet.vn
                    </p>
                  </div>
                  <ControlTextField
                    style={{}}
                    control={control}
                    name="clientId"
                    placeholder="Nhập client ID"
                    minWidth={minW}
                    fullWidth
                    label="Client ID"
                    ditaction="row"
                  />
                  <ControlTextField
                    style={{}}
                    control={control}
                    name="secret"
                    placeholder="Nhập Mã bảo mật"
                    minWidth={minW}
                    fullWidth
                    label="Mã bảo mật"
                    ditaction="row"
                  />
                  <Box>
                    <Button
                      variant="contained"
                      style={{
                        float: "right",
                      }}
                      type="submit"
                    >
                      Kết nối
                    </Button>
                  </Box>
                </form>
              </div>
            )}
            {stepValue === 1 && (
              <div>
                <ListProdConnect />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectAppContent;
