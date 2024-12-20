import styled from "@emotion/styled";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { DEFAULT_PRODUCT_IMAGE } from "src/constants/image";
import useDeleteShopProduct from "src/hooks/api/shop/useDeleteShopProduct";
import useChangeStatusProduct from "src/hooks/product/useChangeStatusProduct";
import useUpdatePriceStock from "src/hooks/product/useUpdatePriceStock";
import UserIcon from "src/layouts/components/UserIcon";
import { Product, UpdateProductPriceStock } from "src/types/product";
import { getImageCheck } from "src/utils/image";
import PopupChangeStatus from "./PopupChangeStatus";
import PopupDelete from "./PopupDelete";
import PopupEditPriceProps from "./PopupEditPrice";
import PopupEditClassifyProduct from "./PopupEditStock";
import { PromotionType } from "src/constants";
interface Props {
  products: Product[];
  onDeleteSuccess: () => void;
  fetchProduct: () => void;
  handleStatusCount?: any;
}

const ProductList = ({
  products,
  onDeleteSuccess,
  fetchProduct,
  handleStatusCount,
}: Props) => {
  console.log("products", products);
  const router = useRouter();
  const [{ data }, handleUpdatePriceStock] = useUpdatePriceStock(
    // lấy lại dữu liệu in ra màn hình
    () => {
      if (fetchProduct) {
        fetchProduct();
      }
    }
  );
  console.log("datadatadata", data);
  const [dataUpdateProduct, setDataUpdateProduct] =
    useState<UpdateProductPriceStock>();
  const [idProduct, setIdProduct] = useState<number>();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  console.log("productSelected", productSelected);
  const [openEditPrice, setOpenEditPrice] = useState(false);
  const [openModalDeleteProduct, setOpenModalDeleteProduct] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [
    { data: statusData, loading: statusLoading },
    handleChangeStatusProduct,
  ] = useChangeStatusProduct({
    onSuccess: () => {
      onDeleteSuccess();
      handleStatusCount && handleStatusCount();
    },
  });
  const [{ response, loading }, handleDeleteShopProduct] = useDeleteShopProduct(
    {
      onSuccess: () => {
        onDeleteSuccess();
      },
    }
  );
  const handleChangeStatus = async () => {
    if (!productSelected?.id) return;
    await handleChangeStatusProduct(+productSelected.id);
    setOpenModalChangeStatus(false);
    setProductSelected(null);
  };
  const handleDelete = async () => {
    if (!productSelected?.id) return;

    await handleDeleteShopProduct([+productSelected.id]);
    setOpenModalDeleteProduct(false);
    setProductSelected(null);
  };

  return (
    <div>
      <StyledTableWrap>
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{
              mb: 4,
              mt: 2,
            }}
          >
            {products?.length} sản phẩm
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  <TableCell align="center">Tên sản phẩm</TableCell>
                  <TableCell align="center">Phân loại hàng</TableCell>
                  <TableCell align="center">Kho hàng</TableCell>
                  <TableCell align="center">Giá</TableCell>
                  <TableCell align="center">Đã bán</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {" "}
                    <TableCell>
                      <Box display={"flex"} alignItems={"center"} columnGap={5}>
                        <img
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                          }}
                          src={
                            row?.images?.[0]?.url
                              ? getImageCheck(row?.images?.[0]?.url)
                              : DEFAULT_PRODUCT_IMAGE
                          }
                          alt=""
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 2,
                          }}
                        >
                          {row.originPrice === PromotionType.ORIGIN_PRICE && (
                            <Chip
                              label="Giá gốc"
                              color="warning"
                              size="small"
                            />
                          )}
                          {row.originPrice === PromotionType.SUCOSUN_MALL && (
                            <Chip
                              label="Exabyte Mall"
                              color="info"
                              size="small"
                            />
                          )}
                          <Typography className="product-name" variant="body2">
                            {row.name}
                          </Typography>
                          {/* <div className="desc">{row.description} </div> */}
                          {/* <div className="desc" dangerouslySetInnerHTML={{ __html: row.description }} /> */}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <Box>
                        <Box>
                          {row?.options?.map((_option: any) => (
                            <div
                              key={_option.id}
                              className="product-classification"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              {_option.name}
                            </div>
                          ))}
                        </Box>
                      </Box>
                      {/* {row.options.length > 3 && (
                            <div onClick={handleShowMore} style={{}}>xem thêm</div>
                          )} */}
                    </TableCell>
                    <TableCell>
                      {row.options.length > 0 ? (
                        <Box
                          style={{
                            display: "flex",
                            columnGap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box>
                            {row?.options?.map((_option: any) => (
                              <div key={_option.id} className="text">
                                {_option.stock}
                              </div>
                            ))}
                          </Box>
                          <AiFillEdit
                            onClick={() => {
                              setOpenModalEdit(true);
                              setProductSelected(row);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            display: "flex",
                            columnGap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box>{row.stock}</Box>
                          <AiFillEdit
                            onClick={() => {
                              setOpenModalEdit(true);
                              setProductSelected(row);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.options.length > 0 ? (
                        <Box
                          style={{
                            display: "flex",
                            columnGap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box>
                            {row?.options?.slice(0, 4).map((_option: any) => (
                              <div
                                key={_option.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  columnGap: "4px",
                                  justifyContent: "center",
                                }}
                                className="text"
                              >
                                {parseFloat(_option.price).toLocaleString(
                                  "vi-VN",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                              </div>
                            ))}
                          </Box>
                          <AiFillEdit
                            onClick={() => {
                              setOpenEditPrice(true);
                              setProductSelected(row);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            display: "flex",
                            columnGap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box>
                            {parseFloat(row.price).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Box>
                          <AiFillEdit
                            onClick={() => {
                              setOpenEditPrice(true);
                              setProductSelected(row);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row?.productSold?.sold ?? 0}
                    </TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          columnGap: "5px",
                          justifyContent: "center",
                        }}
                        className="action"
                      >
                        {/* <div className="text action-item"></div> */}
                        <AiFillEdit
                          size={"24px"}
                          className="text action-item"
                          onClick={() => router.push(`/shop/product/${row.id}`)}
                        >
                          {/* <UserIcon icon="mdi:pencil-outline" /> */}
                        </AiFillEdit>
                        {row?.status === "ACTIVE" ? (
                          <div
                            className="text action-item"
                            onClick={() => {
                              setOpenModalChangeStatus(true);
                              setProductSelected(row);
                            }}
                          >
                            <UserIcon icon="bx:hide" />
                          </div>
                        ) : (
                          <div
                            className="text action-item"
                            onClick={() => {
                              setOpenModalChangeStatus(true);
                              setProductSelected(row);
                            }}
                          >
                            <UserIcon icon="ph:eye" />
                          </div>
                        )}

                        <div
                          onClick={() => {
                            setOpenModalDeleteProduct(true);
                            setProductSelected(row);
                          }}
                          className="text action-item"
                        >
                          <UserIcon icon="material-symbols:delete-outline" />
                        </div>
                        {/* onClick={() => handleDelete([+row.id])} */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <StyledTableWrap>

          <div className="header">
            <StyledColumn
              style={{
              }}
            >
              <div className="name title">Tên sản phẩm</div>
              <div className="classify title">Phân loại hàng</div>
              <div className="price title">Giá</div>
              <div className="inventory title">Kho hàng</div>
              <div className="action title">Thao tác</div>
            </StyledColumn>
          </div>

          {products.map((_product, index) => (
            <ProductCard product={_product} />
          ))}
        </StyledTableWrap> */}
        </Box>
      </StyledTableWrap>
      <PopupDelete
        open={openModalDeleteProduct}
        handleClose={() => setOpenModalDeleteProduct(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <PopupEditClassifyProduct
        handleUpdatePriceStock={handleUpdatePriceStock}
        open={openModalEdit}
        handleClose={() => setOpenModalEdit(false)}
        // @ts-ignore
        productSelected={productSelected}
      />
      <PopupEditPriceProps
        handleUpdatePriceStock={handleUpdatePriceStock}
        open={openEditPrice}
        handleClose={() => setOpenEditPrice(false)}
        // @ts-ignore
        productSelected={productSelected}
      />
      <PopupChangeStatus
        productSelected={productSelected}
        handleClose={() => setOpenModalChangeStatus(false)}
        open={openModalChangeStatus}
        onConfirm={handleChangeStatus}
        statusLoading={statusLoading}
      />
    </div>
  );
};
export default ProductList;

const StyledTableWrap = styled(Box)`
  .product-name,
  .desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .product-name {
    font-weight: bold;
    color: #333;
  }
  .desc {
    font-size: 13px;
    line-height: 1.3;
    color: #666;
  }
  .action {
    color: #2672dd;
  }
  .action-item {
    cursor: pointer;

    :hover {
      color: #0046a8;
    }
  }
  // width: 100%;
  // overflow-x: auto;
  // padding: 8px;
  // border: 1px solid #e0e0e0;
  // border-radius: 5px;
  // position: relative;

  // .title {
  //   white-space: nowrap;
  // }

  // .header {
  //   background-color: #f5f5f5;
  //   padding: 16px;
  // }

  // .bg {
  //   background-color: #f5f5f5;
  //   width: 100%;
  //   position: fixed;
  //   height: 50px;
  //   left: 0;
  //   rigth: 0;
  // }
`;
