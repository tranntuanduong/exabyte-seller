import { FETCH_ORDER_LOG } from "src/constants/api/order";
import useHttpClient from "../useHttpClient";

interface ApiProps {
  codes: string[];
  langType: "en-US" | "zh-CN";
}

interface TraceLogs {
  status: string;
  cod: number;
  modified_at: number;
  product_price: number;
  status_content?: string;
}

interface OrderLogs {
  traceLogs: TraceLogs[];
  code_best: string;
  merchant_order_code: string;
}

const useFetchOrderLogs = () => {
  const [{ data, loading }, _fetchOrderOrder] = useHttpClient<OrderLogs>(
    {
      ...FETCH_ORDER_LOG,
    },
    {
      manual: true,
      dataPath: "data[0]",
    }
  );
  const fetchOrderOrder = async (data: ApiProps) => {
    try {
      await _fetchOrderOrder({
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return { data: data, loading, fetchOrderOrder };
};

export default useFetchOrderLogs;
