import { FETCH_ORDER_LOG, FETCH_ORDER_LOG_GHN } from "src/constants/api/order";
import useHttpClient from "../useHttpClient";

interface ApiProps {
  code: string;
}

interface OrderLogs {
  status: string;
  payment_type_id: number;
  trip_code: string;
  updated_date: string;
}

const useFetchOrderLogGhn = () => {
  const [{ data, loading }, _fetchOrderOrder] = useHttpClient<OrderLogs[]>(
    {
      ...FETCH_ORDER_LOG_GHN,
    },
    {
      manual: true,
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

export default useFetchOrderLogGhn;
