import { FETCH_CATEGORY_KIOT } from "src/constants/api/category";
import { ICategoryKiot, IProductKiot, TreeCategory } from "src/types/category";
import useHttpClient from "../useHttpClient";
import { toast } from "react-hot-toast";
import { getConfigBearer } from "src/constants/api/connect";

interface QueryProps {
  pageSize?: number;
  currentItem?: number;
  name?: string;
}

const useFetchCategoryKiot = () => {
  const [{ data, loading }, _fetch] = useHttpClient<ICategoryKiot[]>(
    {
      ...FETCH_CATEGORY_KIOT,
      ...getConfigBearer(),
    },
    {
      manual: true,
      dataPath: "data.data",
    }
  );

  const fetchCategoryKiot = async (query: QueryProps) => {
    try {
      await _fetch({
        params: query,
      });
    } catch (error) {
      toast.error("Không tìm thấy danh mục");
    }
  };

  return [{ data: data, loading }, fetchCategoryKiot] as const;
};

export default useFetchCategoryKiot;
