import {
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_STATUS_AFFILIATE,
} from "src/constants/api/order";
import { Order, OrderStatus } from "src/types/order";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { getResponseMessage } from "src/utils/response";
import { IS_AFFILIATE } from "src/constants/env";

interface DataProps {
  status: OrderStatus;
  orderId: string;
  warehouseId?: number;

  seperateOrders?: any[];
  forceDimension?: {
    width: number;
    height: number;
    length: number;
  };
}

interface Props {
  onSuccess?: () => void;
}

const useUpdateOrderStatus = ({ onSuccess }: Props) => {
  const [{ data, loading }, _updateOrderStatus] = useHttpClient<Order[]>(
    {
      ...UPDATE_ORDER_STATUS_AFFILIATE,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleUpdateStatus = async (data: DataProps) => {
    try {
      await _updateOrderStatus({
        data: {
          ...data,
          status: data.status,
          warehouseId: data.warehouseId,
          seperateOrders: data?.seperateOrders ?? [],
        },
        param: data.orderId,
      });
      toast.success("Cập nhật trạng thái thành công");
      onSuccess && onSuccess();
    } catch (error) {
      console.log("error123123", error);
      toast.error(getResponseMessage(error) ?? "Cập nhật trạng thái thất bại");
    }
  };
  return [{ data: data ?? [], loading }, handleUpdateStatus] as const;
};

export default useUpdateOrderStatus;
