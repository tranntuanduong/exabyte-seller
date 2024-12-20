import { stringArrToSlug } from "src/utils/string";
import { toast } from "react-hot-toast";
import { TreeCategory } from "src/types/category";
import useHttpClient from "../useHttpClient";
import { FETCH_CATEGORIES } from "src/constants/api/category";

const useFetchCategories = () => {
  const [{ data, loading }, _fetch] = useHttpClient<TreeCategory[]>(
    {
      ...FETCH_CATEGORIES,
    },
    {
      manual: false,
      dataPath: "data",
    }
  );

  data?.sort(function (a: any, b: any) {
    return a.order - b.order;
  });

  return [{ data: data ?? [], loading }, _fetch] as const;
};

export default useFetchCategories;
