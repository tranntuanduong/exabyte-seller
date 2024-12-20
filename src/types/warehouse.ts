import { Product } from "./product";

export interface Warehouse {
  id: number;
  name: string;
  phone: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  products: Product[];
  thirthPartyAddress: string,
  warehouseOptions: WarehouseOption[];
}

export interface WarehouseOption {
  id: number;
  optionStock?: number;
  productId: number;
  productOptionId?: number;
  productStock?: number;
}
