import React from "react";
import useHttpClient from "./useHttpClient";
import { UPDATE_GHTQ_BANKINFO } from "src/constants/api/shop";

import { Address } from "src/types/address";
import { StringLocale } from "yup/lib/locale";
import toast from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}

const useUpdateBankInfo = ({ onSuccess, onError }: Props) => {
  const [{ data, loading }, _update] = useHttpClient(
    {
      ...UPDATE_GHTQ_BANKINFO,
    },
    {
      manual: true,
      dataPath: "data.data",
    }
  );

  const update = async (data: any) => {
    try {
      await _update({
        data: {
          ...data,
        },
      });
      onSuccess && onSuccess();
      toast.success("Cập nhật thông tin thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Cập nhật thông tin thất bại");
      onError && onError(error?.response?.data?.message ?? "Cập nhật thông tin thất bại");
    }
  };
  return { data: data ?? [], loading, update };
};

export default useUpdateBankInfo;
