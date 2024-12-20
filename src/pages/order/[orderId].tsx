import styled from "@emotion/styled";
import { Button, Card, CardHeader, Chip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { Product } from "src/types/product";
import { useAuth } from "src/hooks/useAuth";
import { Fragment, useEffect, useMemo } from "react";
import useFetchOrderDetail from "src/hooks/api/order/useFetchOrderDetail";
import { IMAGE_BASE_URL } from "src/constants/aws";
import UserIcon from "src/layouts/components/UserIcon";
import usePrice from "src/hooks/usePrice";
import { usePickAddress } from "src/hooks/api/shop/usePickAddress";
import PriceBox from "src/components/PriceBox";
import { ORDER_STATUS } from "src/views/pages/order/TableOrder";
import useFetchOrderLogs from "src/hooks/api/order/useFetchOrderLogs";
import dayjs from "dayjs";
import {
  MapBestStatusContent,
  MapBestStatusDescriptions,
  MapBestStatusToNewStatus,
  MapGhnStatusDescriptions,
  MapGhnStatusToNewStatus,
} from "src/constants/order";
import useLogCod from "src/hooks/api/order/useLogCod";
import { isEmpty } from "lodash";
import useFetchOrderLogGhn from "src/hooks/api/order/useFetchOrderLogGhn";

const OrderDetailPage = () => {
  const { user } = useAuth();

  const [{ data: dataOrderDetail, loading }, getOrderDetail] =
    useFetchOrderDetail();

  const { data: logCodData, getLogCod } = useLogCod();

  const { data: orderLog, fetchOrderOrder } = useFetchOrderLogs();

  const { data: dataLogGhn, fetchOrderOrder: fetchLogGhn } =
    useFetchOrderLogGhn();

  console.log("dataLogGhn::", dataLogGhn);

  const { getOptionById } = usePickAddress();
  const router = useRouter();
  useEffect(() => {
    if (!router.query.orderId) return;
    getOrderDetail(router.query.orderId as string);
  }, [router.query.orderId]);

  useEffect(() => {
    if (!dataOrderDetail || !dataOrderDetail.thirthPartyOrderCode) return;

    getLogCod([dataOrderDetail.thirthPartyOrderCode]);
  }, [dataOrderDetail]);

  // fetch order logs
  useEffect(() => {
    if (dataOrderDetail?.shippingUnit === "GHN") {
      fetchLogGhn({
        code: dataOrderDetail.thirthPartyOrderCode,
      });
    } else {
      if (!dataOrderDetail?.orderCode) return;
      fetchOrderOrder({
        codes: [dataOrderDetail?.orderCode ?? ""],
        langType: "en-US",
      });
    }
  }, [dataOrderDetail]);

  console.log("orderLog", orderLog);

  const totalPrice = useMemo(() => {
    return (
      dataOrderDetail?.orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0) ?? 0
    );
  }, [dataOrderDetail]);

  const showAddress = () => {
    if (dataOrderDetail?.province) {
      return `${dataOrderDetail?.name} (${dataOrderDetail?.phone}) - ${
        getOptionById(dataOrderDetail?.ward).ten
      }, ${getOptionById(dataOrderDetail?.district).ten}, ${
        getOptionById(dataOrderDetail?.province).ten
      }, ${dataOrderDetail.shippingAddress}`;
    }

    return dataOrderDetail?.shippingAddress;
  };

  const logCod = dataOrderDetail
    ? logCodData?.[dataOrderDetail.thirthPartyOrderCode]
    : null;

  console.log({ dataOrderDetail });

  return (
    <Card>
      <Information>
        <Status>
          {dataOrderDetail?.status && (
            <Title
              style={{
                color: ORDER_STATUS?.[dataOrderDetail?.status]?.color,
                marginBottom: 10,
              }}
            >
              {ORDER_STATUS?.[dataOrderDetail?.status]?.label}
            </Title>
          )}
          <InformationLine>
            Xác nhận chờ đơn hàng, chờ đóng gói và giao cho đơn vị vận chuyển.
          </InformationLine>
        </Status>
        <div
          style={{
            rowGap: 20,
          }}
        >
          {/* <Note>
            Lưu ý:khi click sẽ đổi trạng <br /> thái đơn hàng sang chờ xác nhận
          </Note> */}
        </div>
      </Information>
      {/* <Information>
        <div style={{ width: "100%" }}>
          <OderHistory style={{ padding: 0, fontWeight: 700 }}>
            <Title>Lịch sử mua hàng của người mua</Title>
          </OderHistory>
          <History>
            <InformationLine
              style={{
                maxWidth: 350,
              }}
            >
              Với người mua có tỉ lệ giao hàng thành công thấp,hãy liên hệ với
              người mua qua kênh Chát để xác nhận đơn trước khi gửi hàng
            </InformationLine>
            <OrderStatus>
              <Ratio>94%</Ratio>
              <InformationLine>Đơn hàng giao thành công</InformationLine>
            </OrderStatus>
          </History>
        </div>
      </Information> */}
      {logCod && (
        <Information>
          <Box>
            <Title>Trạng thái thanh toán đơn hàng</Title>
            <Box>
              <div>
                Trạng thái:{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  <Chip label={logCod.transaction_status} />
                </Box>
              </div>
              <div>Chi tiết: {logCod.reason}</div>
              <div>Số tiền: {logCod.total_amount}</div>
              <div>
                Ngày chuyển: {dayjs(logCod.created_at).format("DD/MM/YYYY")}
              </div>
            </Box>
          </Box>
        </Information>
      )}

      <Information>
        <div>
          <Title>Mã đơn hàng</Title>
          <InformationLine>{dataOrderDetail?.orderCode}</InformationLine>
        </div>
      </Information>
      {orderLog?.traceLogs && (
        <Information
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <Title>Quá trình vận chuyển</Title>
          </div>
          <div>
            {orderLog?.traceLogs?.map((logItem, index) => (
              <Box
                sx={{
                  marginTop: "10px",
                }}
              >
                <InformationLine
                  sx={{
                    ...(index === orderLog?.traceLogs?.length - 1 && {
                      color:
                        ORDER_STATUS[MapBestStatusToNewStatus[logItem?.status]]
                          ?.color,
                      fontWeight: "bold",
                    }),
                  }}
                >
                  <Box component="span">
                    {dayjs(logItem?.modified_at).format("HH:mm  DD/MM/YYYY")}
                  </Box>
                  : {MapBestStatusDescriptions[logItem?.status]}{" "}
                  {logItem.status_content && (
                    <Box component="span">
                      (
                      {MapBestStatusContent[logItem.status_content] ??
                        logItem.status_content}
                      )
                    </Box>
                  )}
                </InformationLine>
              </Box>
            ))}
          </div>
        </Information>
      )}
      {dataLogGhn && (
        <Information
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <Title>Quá trình vận chuyển</Title>
          </div>
          <div>
            {dataLogGhn?.map((logItem, index) => {
              console.log({ logItem });
              return (
                <Box
                  sx={{
                    marginTop: "10px",
                  }}
                >
                  <InformationLine
                    sx={{
                      ...(index === dataLogGhn.length - 1 && {
                        color:
                          ORDER_STATUS[MapGhnStatusToNewStatus[logItem?.status]]
                            ?.color,
                        fontWeight: "bold",
                      }),
                    }}
                  >
                    <Box component="span">
                      {dayjs(logItem.updated_date).format("HH:mm  DD/MM/YYYY")}
                    </Box>
                    : {MapGhnStatusDescriptions[logItem?.status]}
                  </InformationLine>
                </Box>
              );
            })}
          </div>
        </Information>
      )}

      <Information>
        <div>
          <Title>Địa chỉ nhận hàng</Title>
          <InformationLine>{showAddress()}</InformationLine>
        </div>
      </Information>
      <Information>
        <div>
          <Title>Thông tin vận chuyển</Title>
          <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
            <Title>Phí vận tạm tính :</Title>
            <InformationLine>0</InformationLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
            <Title>Phương thức thanh toán:</Title>
            <InformationLine>{dataOrderDetail?.paymentMethod}</InformationLine>
          </div>
        </div>
      </Information>
      <Information>
        <div>
          <Title>Nội dung ghi chú:</Title>
          <InformationLine>
            {dataOrderDetail?.note || "Không ghi chú"}
          </InformationLine>
        </div>
      </Information>
      <Information style={{ alignItems: "center" }}>
        <Feedback>
          <StyleImage>
            {dataOrderDetail?.user?.avatar ? (
              <img
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "100%",
                  objectFit: "cover",
                }}
                src={`${IMAGE_BASE_URL}/${dataOrderDetail?.user?.avatar}`}
              />
            ) : (
              <UserIcon icon="mdi:account-circle-outline" fontSize="35px" />
            )}
          </StyleImage>
          <InformationLine>{dataOrderDetail?.user.username}</InformationLine>
        </Feedback>
        {/* <Box
          style={{
            padding: 0,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              border: "1px solid #cccc",
            }}
          >
            Chat
          </Button>
        </Box> */}
      </Information>
      <TableContainer component={Paper} sx={{ padding: "20px 30px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
              <TableCell>STT</TableCell>
              <TableCell className="product" align="left">
                Sản phẩm
              </TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="center">Đơn giá</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrderDetail?.orderItems.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell align="left" className="product">
                  <Box display={"flex"} alignItems={"center"} columnGap={6}>
                    <Box>
                      <Typography className="product-name" variant="body2">
                        {row?.product?.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {row?.product?.options?.map(
                    (_option: any) =>
                      _option.id === row.optionId && <div>{_option.name}</div>
                  )}
                </TableCell>
                <TableCell align="center">
                  <PriceBox price={row.price} />
                </TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">
                  <PriceBox price={row.price * row.quantity} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RevenueDetails style={{ padding: "0 30px" }}>
        <Title>Thanh toán của người mua:</Title>
        <ProductPrice>
          <div className="box-1">
            <TitleProductPrice>Giá trị đơn hàng</TitleProductPrice>
          </div>

          <div className="box-2">
            <PriceBox price={totalPrice} />
          </div>
        </ProductPrice>
        <ProductPrice>
          <div className="box-1">
            <TitleProductPrice>Giảm giá</TitleProductPrice>
          </div>

          <div className="box-2">
            <PriceBox
              price={
                (dataOrderDetail?.advanceReward ?? 0) +
                (dataOrderDetail?.advanceMallReward ?? 0)
              }
            />
          </div>
        </ProductPrice>
        <ProductPrice>
          <div className="box-1">
            <TitleProductPrice>Tổng thanh toán</TitleProductPrice>
          </div>

          <div className="box-2">
            <PriceBox
              price={
                totalPrice -
                (dataOrderDetail?.advanceReward ?? 0) -
                (dataOrderDetail?.advanceMallReward ?? 0)
              }
            />
          </div>
        </ProductPrice>
      </RevenueDetails>
      <Box
        sx={{
          p: 2,
        }}
      />
    </Card>
  );
};

export default OrderDetailPage;

const Title = styled.div`
  color: rgba(58, 53, 65, 0.87);
  font-size: 16px;
  padding: 0;
  font-weight: 700;
`;

const InformationLine = styled(Box)`
  font-size: 15px;
`;
const Information = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 30px;
`;

const History = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const Ratio = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  font-weight: 700;
  background-color: #ccc;
  border-radius: 100%;
  width: 50px;
  height: 47px;
`;

const StyleImage = styled.div``;
const Feedback = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`;
const Status = styled.div``;
const Note = styled.div`
  max-width: 230px;
  color: red;
  font-size: 14px;
`;
const OderHistory = styled.div``;
const OrderStatus = styled.div`
  align-items: center;
  padding-left: 50px;
  border-left: 2px solid #ccc;
  display: flex;
  column-gap: 10px;
`;
const BillingInformation = styled.div``;
const RevenueDetails = styled.div``;
const ProductPrice = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 40px;
  .box-1 {
    min-width: 270px;
    display: flex;
    flex-direction: column;
    /* border-right: 2px solid #ccc; */
  }
  .box-2 {
    min-width: 100px;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }
`;
const TitleProductPrice = styled.div``;
