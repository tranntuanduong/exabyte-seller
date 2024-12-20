import { Box } from "@mui/material";
import UserIcon from "src/layouts/components/UserIcon";
import { priceCod247 } from "src/utils/order";

const ShippingFeeNote = () => {
  return (
    <Box
      sx={{
        mt: 8,
      }}
    >
      <Box
        sx={{
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <UserIcon icon="mdi:alert-circle-outline" />
        <Box>
          Lưu ý: Phí vận chuyển của đơn hàng sẽ được tính tối ưu theo tiêu chuẩn
          phía GHTQ như sau:
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2,
        }}
      >
        {priceCod247.map((item, index) => (
          <Box
            key={index}
            sx={{
              mt: 2,
            }}
          >
            <Box>{item.name}</Box>
            <Box>{item.description}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShippingFeeNote;
