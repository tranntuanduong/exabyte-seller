import React from "react";
import useHttpClient from "../useHttpClient";
import { GET_NOTIFY } from "src/constants/api/notification";

interface NotifyData {
  title: string;
  content: string;
  receiver: string;
  image: string;
}

const useFetchNotifyCation = () => {
  const [{ data }, _fetch] = useHttpClient<NotifyData[]>(
    {
      ...GET_NOTIFY,
    },
    {
      manual: true,
      dataPath: "data",
    }
  );
  const handleGetNotify = async () => {
    try {
      await _fetch({
        data: data,
      });
    } catch (error) {}
  };
  return [{ data }, handleGetNotify] as const;
};

export default useFetchNotifyCation;
