import React from 'react'
import useHttpClient from '../useHttpClient'
import { GET_SHOP_BUSINESS_PAPER } from 'src/constants/api/shop'
export interface GetShopProps {
  name: string,
  image: string
}
const useFetchShopBusiness = () => {
  const [{ data, loading }, _fetch] = useHttpClient(
    {
      ...GET_SHOP_BUSINESS_PAPER
    },
    {
      manual: true,
      dataPath: "data"
    }
  )
  const getShopBusiness = async (data?: GetShopProps) => {
    try {
      await _fetch({
        data: data
      })
    } catch (error) {

    }
  }
  return [{ data, loading }, getShopBusiness] as const
}

export default useFetchShopBusiness