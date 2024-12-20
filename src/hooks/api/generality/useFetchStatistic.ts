import { FETCH_STATISTIC } from "src/constants/api/generality";
import useHttpClient from "../useHttpClient";
import { DataFetchStatistic } from "src/types/generality";

const useFetchStatistic = () => {
  const [{ data, loading }, _fetchStatistic] =
    useHttpClient<any[]>(
      {
        ...FETCH_STATISTIC,
      },
      {
        manual: true,
        dataPath: "data",
      }
    );
  const fetchStatistic = async (query: any) => {
    try {
      await _fetchStatistic({
        params: query,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return [{ data, loading }, fetchStatistic] as const;
};

export default useFetchStatistic;
