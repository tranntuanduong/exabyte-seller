import { Order } from "src/types/order";
import useHttpClient from "../useHttpClient";
import { LOG_COD } from "src/constants/api/order";

const useLogCod = () => {
  const [{ data, loading }, _fetch] = useHttpClient<Record<string, any>>(
    {
      ...LOG_COD,
    },
    {
      manual: true,
      dataPath: "data.data",
    }
  );

  // const demo: Record<string, any> = {
  //   NI2505091240004: {
  //     order_id: "17438", //Id đơn hàng
  //     order_code: "QN2289083140001",
  //     created_at: "2023-09-04 15:50:05", //Thời gian tạo thanh toán cod
  //     updated_at: "2023-09-04 15:50:05", //Thời gian cập nhật
  //     total_amount: "2800000", //Tổng số tiền thanh toán
  //     bank_number: "0551000323888", // Số tài khoản thanh toán
  //     reason: "GHTQ THANH TOAN NGAY 2023-09-04",
  //     transaction_status: "Thất bại", // Gồm các trạng thái:
  //   },
  //   NI2505091240003: null, // Đơn hàng chưa có thông tin thanh toán COD
  //   NI2505091240002: {
  //     order_id: "17424",
  //     order_code: "QN2289082540006",
  //     created_at: "2023-08-26 16:35:41",
  //     updated_at: "2023-08-26 16:35:41",
  //     total_amount: "300000",
  //     bank_number: null, // Nếu bank_number trả về null + trạng thái đơn hàng Đã thành công thì đơn hàng đó đã thanh toán về Ví GHTQ của tài khoản.
  //     reason: "VIGHTQ_01_QN2289082540006",
  //     transaction_status: "Đã thành công",
  //   },
  // };

  const getLogCod = async (orderCodes: string[]) => {
    try {
      await _fetch({
        data: {
          order_codes: orderCodes,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return { data: data ?? {}, loading, getLogCod };
};

export default useLogCod;
