import { ADD_WAREHOUSE } from "src/constants/api/warehouse";
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
  hasToast: boolean;
}

const useAddWarehouse = ({ onSuccess, hasToast }: Props) => {
  const [{ data, loading }, _addWarehouse] = useHttpClient<any>(
    {
      ...ADD_WAREHOUSE,
    },
    {
      manual: true,
    }
  );

  const addWarehouse = async (data: AddWarehouseParams) => {
    try {
      await _addWarehouse({
        data: {
          ...data,
          ...(!IS_AFFILIATE && {
            warehouseType: "COD247",
          }),
        },
      });
      if (hasToast) {
        toast.success("Thêm mới dữ liệu thành công");
        onSuccess && onSuccess();
      } else {
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.log({ error });
      toast.error(getErrorMessage(error));
    }
  };

  return {
    addWarehouse,
    data,
    loading,
  };
};

export default useAddWarehouse;
