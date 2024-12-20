import { IEditorPropTypes } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/EditorPropTypes";
import { IRequestConfig } from "src/types/http-client.type";

export const ADD_SHOP_CATEGORY: IRequestConfig = {
  url: "/shop-category",
  method: "POST",
  withAuth: true,
};

export const GET_SHOP_CATEGORY: IRequestConfig = {
  url: `/shop-category/all`,
  method: "GET",
  withAuth: true,
};

export const GET_SHOP_CATEGORY_DETAIL: IRequestConfig = {
  url: `/shop-category`,
  method: "GET",
  withAuth: true,
};

export const GET_PRODUCT_OWNER_SEARCH: IRequestConfig = {
  url: `/product/owner/search`,
  method: "GET",
  withAuth: true,
};

export const ADD_PRODUCT_CATEGORY: IRequestConfig = {
  url: "/shop-category",
  method: "PATCH",
  withAuth: true,
};

export const DELETE_SHOP_CATEGORY: IRequestConfig = {
  url: "/shop-category",
  method: "DELETE",
  withAuth: true,
};

export const EDIT_SHOP_CATEGORY: IRequestConfig = {
  url: "/shop-category/update",
  method: "PATCH",
  withAuth: true,
};

export const CHANGE_STATUS_CATEGORY: IRequestConfig = {
  url: "/shop-category",
  method: "PATCH",
  withAuth: true,
};

export const CHANGE_ORDER_CATEGORY: IRequestConfig = {
  url: "/shop-category/order/update",
  method: "PATCH",
  withAuth: true,
};

export const GET_PRODUCT_DETAIL: IRequestConfig = {
  url: "/product/detail",
  method: "GET",
  withAuth: true,
};

export const CONNECT_KIOT_VIET: IRequestConfig = {
  url: "/api-integration/kiotviet-accesstoken",
  method: "POST",
};

export const GET_SHOP_CATEGORY_PRODUCT_ID: IRequestConfig = {
  url: "/shop-category",
  method: "GET",
  withAuth: true,
};
export const UPDATE_IMAGES_BUSINESS_SHOP: IRequestConfig = {
  url: "/shop/business-paper",
  method: "POST",
  withAuth: true,
};
export const GET_SHOP_BUSINESS_PAPER: IRequestConfig = {
  url: "/shop/business-paper",
  method: "GET",
  withAuth: true,
};

export const FETCH_GHTQ_BANK_ID: IRequestConfig = {
  url: "/ghtq/banks",
  method: "GET",
};

export const UPDATE_GHTQ_BANKINFO: IRequestConfig = {
  url: "/ghtq/register",
  method: "POST",
  withAuth: true,
};
