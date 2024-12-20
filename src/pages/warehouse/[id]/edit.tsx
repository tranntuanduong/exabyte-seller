import styled from "@emotion/styled";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IMAGE_BASE_URL } from "src/constants/aws";
import useFetchProduct from "src/hooks/api/shop/useFetchProduct";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import useFetchWarehouseDetails from "src/hooks/api/warehouse/useFetchWarehouseDetails";
import UserIcon from "src/layouts/components/UserIcon";
import { Product } from "src/types/product";
import { getImageCheck } from "src/utils/image";
import AddProductToWarehouseDialog from "src/views/pages/warehouse/AddProductToWarehouseDialog";

interface ProductSelected {
  product: Product;
  type: "add" | "edit";
}

const EditWarehousePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [productSelected, setProductSelected] =
    useState<ProductSelected | null>(null);

  const { data, fetchWarehouse } = useFetchWarehouseDetails();

  const [{ products, count }, fetchProduct] = useFetchProduct({});

  const { getOptionById } = usePickAddress();

  useEffect(() => {
    if (!router.isReady) return;

    fetchWarehouse(router.query.id as string);
    fetchProduct({});
  }, [router]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchProduct({
      page: value,
    });
  };

  const checkProductInWarehouse = (productId: number) => {
    return data?.products?.some((item) => item.id === productId);
  };

  const wareHouseOptionsSelected = useMemo(() => {
    if (productSelected?.type === "add") return;

    if (!data || !productSelected) return [];

    return data?.warehouseOptions?.filter(
      (option) => option.productId == productSelected?.product.id
    );
  }, [data, productSelected?.product.id]);

  console.log("warehgouse", data);

  const getStock = ({
    optionId,
    productId,
  }: {
    productId: number;
    optionId: number | null;
  }) => {
    const warehouseOption = data?.warehouseOptions?.find(
      (item) => item.productId == productId && item.productOptionId == optionId
    );

    if (!warehouseOption) return "N/A";

    if (warehouseOption?.productOptionId) {
      return warehouseOption.optionStock;
    } else {
      return warehouseOption.productStock;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "20px",
          }}
        >
          <h4>Cập nhật kho hàng</h4>
        </Box>
        {data && (
          <StyledWarehouseInfo
            sx={{
              mt: 2,
            }}
          >
            <Box>
              <span>Tên kho hàng:</span> {data.name}
            </Box>
            <Box>
              <span>Số điện thoại:</span> {data.phone}
            </Box>

            <Box>
              <span>Tỉnh/Thành phố:</span> {getOptionById(data?.provinceId).ten}
            </Box>
            <Box>
              <span>Quận/Huyện:</span> {getOptionById(data?.districtId).ten}
            </Box>
            <Box>
              <span>Phường/Xã:</span> {getOptionById(data?.wardId).ten}
            </Box>
          </StyledWarehouseInfo>
        )}

        <StyledTableWrap>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Tồn kho</TableCell>
                  <TableCell align="left">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((row, idx) => {
                  const isReadyInWarehouse = checkProductInWarehouse(row.id);
                  return (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          columnGap={5}
                        >
                          <img
                            style={{
                              width: "56px",
                              height: "56px",
                              objectFit: "cover",
                            }}
                            src={
                              row?.images?.[0]?.url
                                ? getImageCheck(row?.images?.[0]?.url)
                                : ""
                            }
                            alt=""
                          />
                          <Box>
                            <Typography
                              className="product-name"
                              variant="body2"
                            >
                              {row.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        {isReadyInWarehouse ? (
                          <Typography className="product-name" variant="body2">
                            <Chip
                              label="Đã có trong kho"
                              color="success"
                              variant="outlined"
                              size="small"
                            />
                          </Typography>
                        ) : (
                          <Typography className="product-name" variant="body2">
                            <Chip
                              label="Chưa có trong kho"
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.options?.length === 0 ? (
                          <Typography className="product-name" variant="body2">
                            {getStock({ optionId: null, productId: row.id })}
                          </Typography>
                        ) : (
                          <Typography
                            className="product-name"
                            variant="body2"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.options?.map((option) => (
                              <div>
                                {option.name}:{" "}
                                {getStock({
                                  productId: row.id,
                                  optionId: option.id,
                                })}
                              </div>
                            ))}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="action">
                          {isReadyInWarehouse ? (
                            <div
                              className="text action-item"
                              onClick={() =>
                                setProductSelected({
                                  product: row,
                                  type: "edit",
                                })
                              }
                            >
                              Cập nhật tồn kho
                            </div>
                          ) : (
                            <div
                              className="text action-item"
                              onClick={() =>
                                setProductSelected({
                                  product: row,
                                  type: "add",
                                })
                              }
                            >
                              Thêm vào kho
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledTableWrap>
        <Box
          sx={{
            mt: "30px",
          }}
        >
          <Stack>
            <Pagination
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
              count={Math.ceil(count / 5)}
              page={page}
              onChange={handleChange}
            />
          </Stack>
        </Box>
      </CardContent>

      <AddProductToWarehouseDialog
        open={!!productSelected}
        onClose={() => setProductSelected(null)}
        warehouse={data}
        product={productSelected?.product}
        onSuccess={() => fetchWarehouse(router.query.id as string)}
        type={productSelected?.type}
        wareHouseOptionsSelected={wareHouseOptionsSelected}
      />
    </Card>
  );
};

export default EditWarehousePage;

const StyledWarehouseInfo = styled(Box)`
  span {
    font-weight: 600;
  }

  div {
    margin-bottom: 4px;
  }
`;

const StyledTableWrap = styled(Box)`
  .action-item {
    color: #3a7de1;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
