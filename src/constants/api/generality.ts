import { IRequestConfig } from "src/types/http-client.type";

export const FETCH_STATISTIC: IRequestConfig = {
  url: "/statistic/shop/statistic",
  method: "GET",
  withAuth: true,
};
