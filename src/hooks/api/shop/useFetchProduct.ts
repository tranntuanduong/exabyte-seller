import { PRODUCT_LIST } from "src/constants/api/product";
import useHttpClient from "../useHttpClient";
import { Product, StatusQueryProps } from "src/types/product";

export interface SearchProduct {
  keyword?: string;
  page?: number;
  stockFrom?: number;
  stockTo?: number;
  status?: any;
  categoryId?: number;
  minSales?: number;
  maxSales?: number;
}

interface Props {
  manual?: boolean; //hello
}

const useFetchProduct = ({ manual = true }: Props) => {
  const [{ data, loading }, _fetch] = useHttpClient<any>(
    {
      ...PRODUCT_LIST,
    },
    {
      manual: manual,
      dataPath: "data",
    }
  );
  const fetchProductList = async (data?: any) => {
    try {
      await _fetch({
        params: data,
      });
    } catch (error) {}
  };

  return [
    {
      products: (data?.list ?? []) as Product[],
      loading,
      count: data?.count ?? 0,
    },
    fetchProductList,
  ] as const;
};

export default useFetchProduct;
