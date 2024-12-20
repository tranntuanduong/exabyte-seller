import { PromotionType } from "src/constants";

export enum ProductStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  DELETE = -1,
}

export type StatusQueryProps =
  | "ACTICE"
  | "INACTICE"
  | "SOLDOUT"
  | "REVIEWING"
  | "BANNED"
  | "UNLISTED"
  | "UPDATE";
export interface ProductOption {
  id: number;
  sku: string;
  tierIndex: string;
  image: null;
  name: string;
  price: string;
  stock: number;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  priceFrom: string;
  priceTo: string;
  stock: number;
  status: string;
  length: number;
  height: number;
  weight: number;
  width: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
  images: {
    id: number;
    url: string;
  }[];
  tierVariants: {
    id: number;
    name: string;
    options: string;
  }[];
  options: ProductOption[];
  productSold: ProductSold;
  originPrice: PromotionType;
}

interface ProductSold {
  id: number;
  sold: number;
  count_rating_1: number;
  count_rating_2: number;
  count_rating_3: number;
  count_rating_4: number;
  count_rating_5: number;
  rating: number;
}

export interface ProductConnect {
  images: string[];
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  shippingInfo: {
    weight: number;
  };
  status: string;
}
export interface ProductStatusCount {
  status: string;
  count: string;
}
// export interface
export interface UpdateProductPriceStock {
  options: OptionsProduct[];
  productId: number;
}

export interface OptionsProduct {
  optionId: number;
  price: number;
  stock: number;
}
