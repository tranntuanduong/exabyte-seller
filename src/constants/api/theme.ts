import { IRequestConfig } from "src/types/http-client.type";

export const LIST_THEME: IRequestConfig = {
  url: "/theme",
  method: "GET",
  withAuth: true,
};

export const ADD_THEME: IRequestConfig = {
  url: "/shop-theme",
  method: "POST",
  withAuth: true,
};

export const GET_THEME: IRequestConfig = {
  url: "/shop-theme",
  method: "GET",
  withAuth: true,
};

export const UPDATE_THEME: IRequestConfig = {
  url: "/shop-theme/update",
  method: "PATCH",
  withAuth: true,
};
