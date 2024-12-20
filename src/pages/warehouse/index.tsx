import { Box, Button, Card, CardContent } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import UserIcon from "src/layouts/components/UserIcon";

import styled from "@emotion/styled";
import { Pagination } from "@mui/material";
import { IMAGE_BASE_URL } from "src/constants/aws";
import { OrderStatus } from "src/types/order";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useFetchWarehouses from "src/hooks/api/warehouse/useFetchWarehouses";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import AddWarehouseDialog from "src/views/pages/warehouse/AddWarehouseDialog";
import { Warehouse } from "src/types/warehouse";
import { IS_AFFILIATE } from "src/constants/env";

const WarehousePage = () => {
  const [openAddWarehouseDialog, setOpenAddWarehouseDialog] = useState(false);
  const [warehouseSelected, setWarehouseSelected] = useState<Warehouse | null>(
    null
  );
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const { data, loading, fetchWarehouse } = useFetchWarehouses();
  const { getOptionById } = usePickAddress();

  const successHandler = () => {
    setOpenAddWarehouseDialog(false);
    fetchWarehouse();
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenAddWarehouseDialog(true)}
          >
            Thêm mới kho hàng
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                <TableCell>Tên kho</TableCell>
                <TableCell align="left">Số điện thoại</TableCell>
                <TableCell align="left">Tỉnh/Thành Phố</TableCell>
                <TableCell align="left">Quận/Huyện</TableCell>
                <TableCell align="left">Phường/Xã</TableCell>
                <TableCell align="left">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, idx) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{getOptionById(row.provinceId).ten}</TableCell>
                  <TableCell>{getOptionById(row.districtId).ten}</TableCell>
                  <TableCell>{getOptionById(row.wardId).ten}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "10px",
                      }}
                    >
                      {IS_AFFILIATE && (
                        <UserIcon
                          icon="mdi:pencil-outline"
                          onClick={() => {
                            setOpenAddWarehouseDialog(true);
                            setWarehouseSelected(row);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      )}
                      <UserIcon
                        icon="fluent-mdl2:product-release"
                        onClick={() => router.push(`/warehouse/${row.id}/edit`)}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <AddWarehouseDialog
        open={openAddWarehouseDialog}
        onClose={() => setOpenAddWarehouseDialog(false)}
        onSuccess={successHandler}
        warehouseSelected={warehouseSelected}
      />
    </Card>
  );
};

export default WarehousePage;

const CustomStyledCell = styled(TableCell)`
  border: none;
  white-space: nowrap;
`;
