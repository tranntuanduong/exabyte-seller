import { IRequestConfig } from "src/types/http-client.type";

export const SHOP_CHANGE_PASSWORD: IRequestConfig = {
  url: "/shop/change-password",
  method: "PATCH",
  withAuth: true,
}