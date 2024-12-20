
import { GET_NOTIFY } from "src/constants/api/notification";
import useHttpClient from "./useHttpClient"
export interface ShopNotify {
  title: string,
  content: string,
  receiver: string
}
const useFetchNotify = () => {
  const [{ data, loading }, _fetch] = useHttpClient<ShopNotify>(
    {
      ...GET_NOTIFY
    },
    {
      manual: true,
      dataPath: "data",
    }
  )
  const fetchNotify = async () => {
    try {
      await _fetch({
        params: {
          receiver: "SHOP",
        }

      });
    } catch (error) {
      console.log(error);
    }
  };

  return [{ data, loading }, fetchNotify] as const;
}
export default useFetchNotify