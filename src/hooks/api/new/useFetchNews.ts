import useHttpClient from "../useHttpClient";
import { GET_NEWS } from "src/constants/api/new";

interface AddProps {
  page: number;
}

const useFetchNews = () => {
  const [{ data, loading }, _fetch] = useHttpClient(
    {
      ...GET_NEWS,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const handleGetNews = async (data: AddProps) => {
    try {
      await _fetch({
        params: {
          ...data,
          role: "SHOP",
          take: 10,
        },
      });
    } catch (error) {}
  };

  return {
    count: data?.count ?? 1,
    list: data?.list ?? [],
    loading,
    handleGetNews,
  };
};

export default useFetchNews;
