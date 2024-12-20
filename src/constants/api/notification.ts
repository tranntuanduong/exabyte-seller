import { IRequestConfig } from "src/types/http-client.type";

export const GET_NOTIFY: IRequestConfig = {
  url: "/notify",
  method: "GET",
  withAuth: true,
};
