
import { Box, Card, CardContent, Divider, Typography } from "@mui/material"
import React from "react";
import AccessibleTabs1 from "./SettingShop";
import ControlledSwitches from "./BoxSettings";

const SettingsPage = () => {
  return (
    <Card>
      <CardContent>

        <Typography sx={{ fontSize: 30, fontWeight: 700, color: 'black' }}>Thiết lập shop</Typography>
        <Typography>
          Thay đổi các cài đặt cho shop của bạn
        </Typography>

        <AccessibleTabs1 />
        <Divider sx={{ mt: "0 !important" }} />
        <Box sx={{ mt: 5 }}>
          <ControlledSwitches />
        </Box>

      </CardContent >
    </Card>

  )
}

export default SettingsPage