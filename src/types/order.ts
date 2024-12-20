import { UserDataType } from "src/context/types";
import { Product } from "./product";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  WAITING_TRANSFER = "WAITING_TRANSFER",
}

export enum PaymentMethod {
  "COD" = "COD",
}

export enum CurrencyCode {
  "vn" = "vn",
}

export interface Order {
  id: number;
  status: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  note: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: UserDataType;
  orderCode?: string;
  ward?: string;
  district?: string;
  province?: string;
  name?: string;
  phone?: string;
  shippingUnit: "OTHER" | "BEST" | "COD247" | "GHN";
  thirthPartyOrderCode: string;
  advanceReward: number;
  advanceMallReward: number;
}

export interface OrderItem {
  id: number;
  optionId: number | null;
  quantity: number;
  price: number;
  currencyCode: CurrencyCode;
  createdAt: string;
  updatedAt: string;
  product: Product;
  warehouseId?: number;
}
