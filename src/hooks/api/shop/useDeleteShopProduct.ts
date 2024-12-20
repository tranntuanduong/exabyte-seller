import { DELETE_PRODUCT } from "src/constants/api/product"
import useHttpClient from "../useHttpClient"

interface Props {
  onSuccess: () => void
}
const useDeleteShopProduct = ({ onSuccess }: Props) => {
  const [{ data, loading, error, response }, _handleDeleteShopProduct] = useHttpClient<any>(
    {
      ...DELETE_PRODUCT
    },
    {
      manual: true,
      dataPath: "data"
    }
  )
  console.log('ccc', data)
  const handleDeleteShopProduct = async (ids: number[]) => {
    try {
      await _handleDeleteShopProduct({
        data: {
          productIds: ids
        }
      })
      onSuccess && onSuccess()
    } catch (error) {

    }
  }
  return [
    {
      data,
      loading,
      error,
      response
    }, handleDeleteShopProduct] as const
}

export default useDeleteShopProduct