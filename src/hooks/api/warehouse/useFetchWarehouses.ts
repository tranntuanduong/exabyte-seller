import { ADD_WAREHOUSE, FETCH_WAREHOUSES } from "src/constants/api/warehouse";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "src/utils/mapError";
import { useAuth } from "src/hooks/useAuth";
import { Warehouse } from "src/types/warehouse";

const useFetchWarehouses = () => {
  const { user } = useAuth();

  const [{ data, loading }, _fetch] = useHttpClient<Warehouse[]>(
    {
      ...FETCH_WAREHOUSES,
    },
    {
      manual: true,
      dataPath: "data",
      autoCancel: false,
    }
  );

  return {
    data: data,
    loading,
    fetchWarehouse: _fetch,
  };
};

export default useFetchWarehouses;
