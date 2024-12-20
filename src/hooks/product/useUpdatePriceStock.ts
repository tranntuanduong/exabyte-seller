import React from 'react'
import useHttpClient from '../api/useHttpClient'
import { UPDATE_PRODUCT_PRICE_STOCK } from 'src/constants/api/product'
import { UpdateProductPriceStock } from 'src/types/product'
import { toast } from 'react-hot-toast'

const useUpdatePriceStock = (callback: () => void) => {
  const [{ data, loading }, _updateProduct] = useHttpClient(
    {
      ...UPDATE_PRODUCT_PRICE_STOCK
    },
    {
      dataPath: "data",
      manual: true
    }
  )
  const handleUpdatePriceStock = async (data?: UpdateProductPriceStock) => {
    try {
      await _updateProduct({
        data: data
      })
      callback()
      toast.success('Cập nhật thành công')
    } catch (error) {
      toast.error('Cập nhật thất bại')
    }
  }
  return [{ data, loading }, handleUpdatePriceStock] as const
}

export default useUpdatePriceStock