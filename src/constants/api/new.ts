import { IRequestConfig } from "src/types/http-client.type";

export const ADD_NEW: IRequestConfig = {
  url: "/new",
  method: "POST",
  withAuth: true,
};

export const UPDATE_NEW: IRequestConfig = {
  url: "/new",
  method: "PUT",
  withAuth: true,
};

export const GET_NEWS: IRequestConfig = {
  url: "/new",
  method: "GET",
  withAuth: true,
};

export const DELETE_NEW: IRequestConfig = {
  url: "/new",
  method: "DELETE",
  withAuth: true,
};

export const GET_NEW_BY_ID_OR_SLUG: IRequestConfig = {
  url: "/new",
  method: "GET",
};
