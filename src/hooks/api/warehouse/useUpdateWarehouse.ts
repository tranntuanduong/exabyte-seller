import { toast } from "react-hot-toast";
import { UPDATE_WAREHOUSE } from "src/constants/api/warehouse";
import { getErrorMessage } from "src/utils/mapError";
import useHttpClient from "../useHttpClient";

export interface WareHouseForm {
  warehouseId?: number;
  productId?: number;
  warehouseOptions: WarehouseOption[];
}

interface WarehouseOption {
  productOptionId?: number | null;
  productStock?: number;
  optionStock?: number;
  id?: number;
}

interface Props {
  onSuccess?: () => void;
}

const useUpdateWarehouse = ({ onSuccess }: Props) => {
  const [{ data, loading }, _updateWarehouse] = useHttpClient<any>(
    {
      ...UPDATE_WAREHOUSE,
    },
    {
      manual: true,
    }
  );

  const updateWarehouse = async (data: WareHouseForm) => {
    try {
      await _updateWarehouse({
        data: {
          ...data,
        },
        param: `${data.warehouseId}`,
      });
      toast.success("Cập nhật dữ liệu thành công");
      onSuccess && onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    updateWarehouse,
    data,
    loading,
  };
};

export default useUpdateWarehouse;
