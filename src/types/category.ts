export interface TreeCategory {
  id: number;
  name: string;
  description: null;
  thumbnail: string;
  slug: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
  childrens: TreeCategory[];
}

export interface ICategoryKiot {
  categoryId: number;
  categoryName: string;
  rank: number;
  retailerId: number;
}

export interface IProductKiot {
  true: boolean;
  barCode: string;
  basePrice: number;
  categoryId: number;
  categoryName: string;
  code: string;
  conversionValue: number;
  createdDate: string;
  description: string;
  fullName: string;
  hasVariants: boolean;
  id: number;
  images: string[];
  inventories: {
    actualReserved: number;
    branchId: number;
    branchName: string;
    cost: number;
    maxQuantity: number;
    minQuantity: number;
    onHand: number;
    productCode: string;
    productId: number;
    productName: string;
    reserved: number;
  }[];
  isActive: boolean;
  isLotSerialControl: boolean;
  name: string;
  orderTemplate: string;
  retailerId: number;
  tradeMarkName: string;
  type: number;
  unit: string;
  weight: number;
}
