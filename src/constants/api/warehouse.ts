import { IRequestConfig } from "src/types/http-client.type";

export const ADD_WAREHOUSE: IRequestConfig = {
  url: "/warehouse",
  method: "POST",
  withAuth: true,
};

export const UPDATE_WAREHOUSE_ADDRESS: IRequestConfig = {
  url: "/warehouse/address",
  method: "PATCH",
  withAuth: true,
};


export const FETCH_WAREHOUSES: IRequestConfig = {
  url: "/warehouse",
  method: "GET",
  withAuth: true,
};

export const FETCH_WAREHOUSE_DETAILS: IRequestConfig = {
  url: "/warehouse",
  method: "GET",
  withAuth: false,
};

export const UPDATE_WAREHOUSE: IRequestConfig = {
  url: "/warehouse",
  method: "PATCH",
  withAuth: true,
};
