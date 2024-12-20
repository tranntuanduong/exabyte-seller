import React from 'react'
import useHttpClient from '../api/useHttpClient'
import { CHANGE_STATUS_PRODUCT } from 'src/constants/api/product'
import { toast } from 'react-hot-toast'
interface Props {
  onSuccess: () => void
}
const useChangeStatusProduct = ({ onSuccess }: Props) => {
  const [{ data, loading }, _handleChangeStatus] = useHttpClient(
    {
      ...CHANGE_STATUS_PRODUCT
    },
    {
      manual: true,
      dataPath: "data"
    }
  )
  const handleChangeStatusProduct = async (productId: number) => {
    try {
      await _handleChangeStatus({
        param: `${productId}/change/status`
      })
      onSuccess && onSuccess()
      toast.success("Cập nhật thành công")
    } catch (error) {

    }
  }
  return [{ data, loading }, handleChangeStatusProduct] as const
}

export default useChangeStatusProduct