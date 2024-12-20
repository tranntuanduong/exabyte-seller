import { IRequestConfig } from "src/types/http-client.type";

export const FETCH_CATEGORIES: IRequestConfig = {
  url: "/category",
  method: "GET",
};

export const FETCH_CATEGORY_KIOT: IRequestConfig = {
  url: "/api-integration/kiotviet-categories",
  method: "GET",
};

export const FETCH_PRODUCT_KIOT: IRequestConfig = {
  url: "/api-integration/kiotviet-products",
  method: "GET",
};

export const UPDATE_CATEGORY_ORDER: IRequestConfig = {
  url: "/shop-category/order/update",
  method: "PATCH",
  withAuth: true,
};
