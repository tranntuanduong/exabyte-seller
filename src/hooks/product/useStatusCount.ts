import React from "react";
import useHttpClient from "../api/useHttpClient";
import { PRODUCT_STATUS_COUNT } from "src/constants/api/product";
import { ProductStatusCount } from "src/types/product";

const useStatusCount = () => {
  const [{ data, loading }, _fetch] = useHttpClient(
    {
      ...PRODUCT_STATUS_COUNT,
    },
    {
      manual: true,
      // dataPath: "data",
    }
  );

  const handleStatusCount = async (data?: ProductStatusCount) => {
    try {
      await _fetch({
        data: data,
      });
    } catch (error) { }
  };
  console.log("123xxx", data);

  return [{ data: data?.data ?? [], loading }, handleStatusCount] as const;
};

export default useStatusCount;
