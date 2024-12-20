import { IRequestConfig } from "src/types/http-client.type";

export const PRODUCT_LIST: IRequestConfig = {
  url: "product/owner/search",
  method: "GET",
  withAuth: true,
};
export const ADD_PRODUCT: IRequestConfig = {
  url: "/product",
  method: "POST",
  withAuth: true,
};

export const UPDATE_PRODUCT: IRequestConfig = {
  url: "/product",
  method: "PUT",
  withAuth: true,
};

export const DELETE_PRODUCT: IRequestConfig = {
  url: "/product",
  method: "DELETE",
  withAuth: true,
};

export const DELETE_PRODUCT_SHOP_CATEGORY: IRequestConfig = {
  url: "/shop-category/product",
  method: "DELETE",
  withAuth: true,
};
export const PRODUCT_STATUS_COUNT: IRequestConfig = {
  url: "/product/status/count",
  method: "GET",
  withAuth: true
}
export const UPDATE_PRODUCT_PRICE_STOCK: IRequestConfig = {
  url: "/product/price-stock",
  method: "PATCH",
  withAuth: true
}
export const CHANGE_STATUS_PRODUCT: IRequestConfig = {
  url: "/product",
  method: "PATCH",
  withAuth: true
}
