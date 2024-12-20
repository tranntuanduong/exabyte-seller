import React from "react";
import { FETCH_SHOP_ORDER } from "src/constants/api/order";
import { Order } from "src/types/order";
import useHttpClient from "../useHttpClient";

const useFetchShopOrder = () => {
  const [{ data, loading }, _fetchShopOrder] = useHttpClient(
    {
      ...FETCH_SHOP_ORDER,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );

  const fetchShopOrder = async (data?: any) => {
    try {
      return await _fetchShopOrder({
        params: data,
      });
    } catch (error) {}
  };

  const totalCount = data?.count?.reduce(
    (acc: number, cur: any) => acc + +cur.count,
    0
  );

  const countInfo = data?.count?.reduce(
    (acc: any, cur: any) => {
      return {
        ...acc,
        [cur.status]: cur.count,
      };
    },
    {
      PENDING: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      RETURNED: 0,
    }
  );

  return [
    {
      data: data?.list ?? [],
      loading,
      count: totalCount,
      countInfo: countInfo,
    },
    fetchShopOrder,
  ] as const;
};

export default useFetchShopOrder;
