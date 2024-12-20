import { IRequestConfig } from "src/types/http-client.type";



export const SHOP_STATUS: IRequestConfig = {
  url: "/shop/status",
  method: "GET",
  withAuth: true
}

export const SHOP_UPDATE_ESTABLISH: IRequestConfig = {
  url: "/shop/status",
  method: "PATCH",
  withAuth: true
}
