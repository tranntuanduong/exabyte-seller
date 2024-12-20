import {
  ADD_WAREHOUSE,
  UPDATE_WAREHOUSE_ADDRESS,
} from "src/constants/api/warehouse";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "src/utils/mapError";
import { IS_AFFILIATE } from "src/constants/env";

export interface AddWarehouseParams {
  name: string;
  phone: string;
  provinceId: string | null;
  districtId: string | null;
  wardId: string | null;
  addressDetail: string;
  id?: number;
}

interface Props {
  onSuccess?: () => void;
}

const useUpdateWarehouseAddress = ({ onSuccess }: Props) => {
  const [{ data, loading }, _updateWarehouse] = useHttpClient<any>(
    {
      ...UPDATE_WAREHOUSE_ADDRESS,
    },
    {
      manual: true,
    }
  );

  const updateWarehouseAddress = async (data: AddWarehouseParams) => {
    try {
      await _updateWarehouse({
        data: {
          ...data,
          ...(!IS_AFFILIATE && {
            warehouseType: "COD247",
          }),
        },
        param: `${data.id}`,
      });
      toast.success("Thêm mới dữ liệu thành công");
      onSuccess && onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    updateWarehouseAddress,
    data,
    loading,
  };
};

export default useUpdateWarehouseAddress;
