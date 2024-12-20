import { toast } from "react-hot-toast";
import { PRINT_COD247_ORDER } from "src/constants/api/order";
import useHttpClient from "../useHttpClient";

const usePrintOrderCod247 = () => {
  const [{ data, loading }, _handlePrintOrder] = useHttpClient(
    {
      ...PRINT_COD247_ORDER,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handlePrintOrder = (codes: string[]) => {
    try {
      _handlePrintOrder({
        data: {
          order_codes: codes,
        },
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi in đơn hàng");
    }
  };

  return {
    handlePrintOrder,
    data,
    loading,
  };
};

export default usePrintOrderCod247;
