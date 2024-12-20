import { DELETE_NEW } from "src/constants/api/new";
import useHttpClient from "../useHttpClient";

const useDeleteNew = () => {
  const [{ data, loading }, _handler] = useHttpClient(
    {
      ...DELETE_NEW,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  return {
    data,
    loading,
    handleDelete: _handler,
  };
};

export default useDeleteNew;
