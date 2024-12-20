import { IRequestConfig } from "src/types/http-client.type";

export const SHOP_PROFILE: IRequestConfig = {
  url: "/shop/profile",
  method: "GET",
  withAuth: true,
};
export const SHOP_UPDATE_PROFILE: IRequestConfig = {
  url: "/shop/profile",
  method: "PATCH",
  withAuth: true,
};

export const SHOP_UPDATE_REFERRAL_USER: IRequestConfig = {
  url: "/shop/update-referal-user",
  method: "PATCH",
  withAuth: true,
};

export const FETCH_USER_BY_REFCODE: IRequestConfig = {
  url: "/user/get-user-by-ref-code",
  method: "GET",
  withAuth: true,
};
