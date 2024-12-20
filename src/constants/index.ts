export const urlImage =
  process.env.NEXT_PUBLIC_IMAGE_URL ??
  "https://sucosun-s3.s3.ap-southeast-1.amazonaws.com";

export enum PromotionType {
  ORIGIN_PRICE = "ACTIVE",
  SUCOSUN_MALL = "SUCOSUN_MALL",
  INACTIVE = "INACTIVE",
}

export const urlPrintGhn =
  "https://online-gateway.ghn.vn/a5/public-api/print52x70?token=";
