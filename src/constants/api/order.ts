import { METHODS } from "http";
import { IRequestConfig } from "src/types/http-client.type";

export const FETCH_SHOP_ORDER: IRequestConfig = {
  url: "/order/shop",
  method: "GET",
  withAuth: true,
};

export const UPDATE_ORDER_STATUS: IRequestConfig = {
  url: "/order/shop/status",
  method: "PATCH",
  withAuth: true,
};

export const UPDATE_ORDER_STATUS_AFFILIATE: IRequestConfig = {
  url: "/order/shop/status/affiliate",
  method: "PATCH",
  withAuth: true,
};

export const PRINT_BESS_ORDER: IRequestConfig = {
  url: "/bestexpress/print-order",
  method: "POST",
};

export const PRINT_COD247_ORDER: IRequestConfig = {
  url: "/ghtq/print-order",
  method: "POST",
  withAuth: true,
};

export const FETCH_ORDER_DETAIL: IRequestConfig = {
  url: "/order/shop/detail",
  method: "GET",
  withAuth: true,
};

export const FETCH_ORDER_LOG: IRequestConfig = {
  url: "/bestexpress/log",
  method: "POST",
  withAuth: true,
};

export const LOG_COD: IRequestConfig = {
  url: "/ghtq/log-cod",
  method: "POST",
  withAuth: true,
};

export const FETCH_ORDER_LOG_GHN: IRequestConfig = {
  url: "/ghn/log-order",
  method: "POST",
  withAuth: true,
};

export const PRINT_GHN_ORDER: IRequestConfig = {
  url: "/ghn/print-order",
  method: "POST",
};
