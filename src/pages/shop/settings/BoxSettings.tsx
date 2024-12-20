import * as React from "react";
import Switch from "@mui/material/Switch";
import { useEffect } from "react";

import { Box, Typography, createTheme } from "@mui/material";
import UserIcon from "src/layouts/components/UserIcon";
import useEstabLish from "src/hooks/api/useEstabLish";
import useFetchShopStatus from "src/hooks/api/useFetchShopStatus";
import { useAuth } from "src/hooks/useAuth";
import { ShopStatus } from "src/types/shop.type";

export default function ControlledSwitches() {
  const { user } = useAuth();
  const [checked, setChecked] = React.useState(true);
  const [{ data, loading }, getEstabLish] = useEstabLish();

  console.log("user", user);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    getEstabLish();
  };

  useEffect(() => {
    if (!user) return;

    const isChecked = user.isActive === ShopStatus.ACTIVE;

    setChecked(isChecked);
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          columnGap: "3%",
          opacity: !checked ? 0.5 : 1,
        }}
      >
        <UserIcon icon="mdi:weather-night" />
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
            Chế độ tạm nghỉ
          </Typography>
          <Typography>
            kích hoạt chế độ tạm nghỉ để ngăn khách hàng đặt đơn hàng mới. Những
            đơn hàng đang tiến hành vẫn phải được xử lý{" "}
          </Typography>
        </Box>
      </Box>
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
    </Box>
  );
}
