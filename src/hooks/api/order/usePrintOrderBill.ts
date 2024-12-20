import { FETCH_SHOP_ORDER, PRINT_BESS_ORDER } from "src/constants/api/order";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { useState } from "react";

const usePrintOrderBill = () => {
  const [{ data, loading }, _handlePrintOrder] = useHttpClient(
    {
      ...PRINT_BESS_ORDER,
    },
    {
      manual: true,
      // dataPath: "data",
    }
  );

  const handlePrintOrder = (codes: string[]) => {
    try {
      _handlePrintOrder({
        data: {
          codes,
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

export default usePrintOrderBill;
