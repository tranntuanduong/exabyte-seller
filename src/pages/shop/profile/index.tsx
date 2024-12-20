import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import * as yup from "yup";
import { TabContext, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import useFetchProfile from "src/hooks/api/useFetchProfile";
import useUpdateProfile from "src/hooks/api/shop/useUpdateProfile";
import ProfileTab from "src/views/pages/profile/ProfileTab";
import ChangePasswordTab from "src/views/pages/profile/ChangePasswordTab";
import { useAuth } from "src/hooks/useAuth";
import BankInfomationTab from "src/views/pages/profile/BankInfomationTab";
import { IS_AFFILIATE } from "src/constants/env";

const schemaValidate = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .default("testemail@gmail.com"),
  name: yup.string().required("Vui lòng nhập tên shop").default(""),
  description: yup.string().required("Vui lòng nhập mô tả shop").default(""),
});

export interface UpdateProfileForm {
  name: string;
  description: string;
  email: string;
  avatar?: string;
  link?: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  console.log("user", user);
  const [value, setValue] = useState("0");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Card>
      <CardHeader title="Hồ sơ shop"></CardHeader>
      <CardContent>
        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab value={"0"} label="Thông tin cơ bản" />
            {!IS_AFFILIATE && <Tab value={"1"} label="Thông tin thanh toán" />}
            <Tab value={"2"} label="Đổi mật khẩu" />
          </Tabs>
          <Divider sx={{ mt: "0 !important" }} />
          <TabPanel value={"0"}>
            <ProfileTab />
          </TabPanel>
          <TabPanel value={"1"}>
            {!IS_AFFILIATE && <BankInfomationTab />}
          </TabPanel>
          <TabPanel value={"2"}>
            <ChangePasswordTab />
          </TabPanel>
        </TabContext>
      </CardContent>
    </Card>
  );
};
export default ProfilePage;
