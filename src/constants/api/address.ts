import { METHODS } from "http";
import { IRequestConfig } from "src/types/http-client.type";

export const GET_LIST_SHOP_ADDRESS: IRequestConfig = {
  url: "/shop-address",
  method: "GET",
  withAuth: true,
};

export const CREATE_SHOP_ADDRESS: IRequestConfig = {
  url: "/shop-address",
  method: "POST",
  withAuth: true,
};
export const UPDATE_SHOP_ADDRESS: IRequestConfig = {
  url: "/shop-address",
  method: "PATCH",
  withAuth: true,
};

export const DELETE_SHOP_ADDRESS: IRequestConfig = {
  url: "/shop-address",
  method: "DELETE",
  withAuth: true,
};
