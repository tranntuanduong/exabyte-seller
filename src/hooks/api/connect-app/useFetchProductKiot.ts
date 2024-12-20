import { toast } from "react-hot-toast";
import { FETCH_PRODUCT_KIOT } from "src/constants/api/category";
import { getConfigBearer } from "src/constants/api/connect";
import { ICategoryKiot, IProductKiot } from "src/types/category";
import useHttpClient from "../useHttpClient";

interface QueryProps {
  pageSize: number;
  currentItem: number;
  categoryId: number;
}

const useFetchProductKiot = () => {
  const [{ data, loading }, _fetch] = useHttpClient<IProductKiot[]>(
    {
      ...FETCH_PRODUCT_KIOT,
      ...getConfigBearer(),
    },
    {
      manual: true,
      dataPath: "data.data",
    }
  );

  const fetchProductKiot = async (query?: any) => {
    try {
      await _fetch({
        params: {
          includeInventory: true,
          includePricebook: true,
          ...query,
        },
      });
    } catch (error) {
      toast.error("Không tìm thấy sản phẩm");
    }
  };

  return [{ data: data, loading }, fetchProductKiot] as const;
};

export default useFetchProductKiot;
