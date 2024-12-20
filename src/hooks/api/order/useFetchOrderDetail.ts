import { Order } from "src/types/order";
import useHttpClient from "../useHttpClient";
import { FETCH_ORDER_DETAIL } from "src/constants/api/order";

const useFetchOrderDetail = () => {
  const [{ data, loading }, _FetchOderDetail] = useHttpClient<Order>(
    {
      ...FETCH_ORDER_DETAIL,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );
  const getOrderDetail = async (orderId: any) => {
    try {
      if (orderId) {
        console.log("orderIdxxxxx", orderId);

        await _FetchOderDetail({
          param: `${orderId}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [{ data, loading }, getOrderDetail] as const;
};

export default useFetchOrderDetail;
