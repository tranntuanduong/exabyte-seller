import {
  ADD_WAREHOUSE,
  FETCH_WAREHOUSE_DETAILS,
} from "src/constants/api/warehouse";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "src/utils/mapError";
import { useAuth } from "src/hooks/useAuth";
import { Warehouse } from "src/types/warehouse";

const useFetchWarehouseDetails = () => {
  const { user } = useAuth();

  const [{ data, loading }, _fetch] = useHttpClient<Warehouse>(
    {
      ...FETCH_WAREHOUSE_DETAILS,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const fetchWarehouseDetails = async (warehouseId: string) => {
    try {
      await _fetch({
        param: warehouseId,
      });
    } catch (error) {}
  };

  return {
    data: data,
    loading,
    fetchWarehouse: fetchWarehouseDetails,
  };
};

export default useFetchWarehouseDetails;
