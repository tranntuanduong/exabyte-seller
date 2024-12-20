import { urlImage } from "src/constants";

export const getImageCheck = (url: string) => {
  if (url?.includes("https")) {
    return url;
  }

  console.log("urlImage", urlImage);

  return urlImage + "/" + url;
};
