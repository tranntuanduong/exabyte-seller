import React from 'react'
import useHttpClient from '../useHttpClient'
import { UPDATE_IMAGES_BUSINESS_SHOP } from 'src/constants/api/shop'
import { UpdateBusiness } from 'src/types/shop.type'

const useAddBusinessImagesShop = () => {
  const [{ data, loading }, _handleAddBusinessImages] = useHttpClient(
    {
      ...UPDATE_IMAGES_BUSINESS_SHOP,
    },
    {
      manual: true,
      dataPath: "data",
      autoCancel: false
    }
  )
  const handleAddBusiness = async (data: any) => {
    try {
      await _handleAddBusinessImages({ data })
    } catch (error) {

    }
  }
  return [{ data, loading }, handleAddBusiness] as const
}

export default useAddBusinessImagesShop