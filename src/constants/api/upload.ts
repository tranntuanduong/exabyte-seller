import { IRequestConfig } from "src/types/http-client.type";

export const UPLOAD_IMAGE: IRequestConfig = {
  url: "/files/upload",
  method: "POST",
  withAuth: true,
};

export const MULTIPLE_UPLOAD_IMAGE: IRequestConfig = {
  url: "/files/upload-multiple",
  method: "POST",
  withAuth: true,
};
