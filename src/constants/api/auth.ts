import { IRequestConfig } from "src/types/http-client.type";

export const SHOP_LOGIN: IRequestConfig = {
  url: "/shop/login",
  method: "POST",
};


export const SHOP_REGISTER: IRequestConfig = {
  url: "/shop/register",
  method: "POST",
};
