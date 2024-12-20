export enum ShopStatus {
  ACTIVE = "1",
  INNATIVE = "0",
}

export interface NewShopCategoryProps {
  name: string;
  slug: string;
}

export interface DataCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  products: [
    {
      id: 3;
      name: string;
      description: string;
      price: number;
      priceFrom: number;
      priceTo: number;
      stock: number;
      status: string;
      video: null;
      length: number;
      height: number;
      weight: number;
      width: number;
      sku: string;
      code: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      images: [
        {
          id: number;
          url: string;
          order: string;
        }
      ];
    }
  ];
}

export interface ProductProps {
  description: string;
  height: number;
  id: string;
  length: number;
  name: string;
  price: string;
  priceFrom: string;
  priceTo: string;
  sku: string;
  status: string;
  stock: number;
  weight: number;
  width: number;
}
export interface DataCategoryDetail {
  id: number;
  name: string;
  order: number;
  products: ProductProps[];
  slug: string;
  status: string;
}

export interface DataOrderProps {
  data: [
    {
      id: number;
      order: number;
    }
  ];
}
export interface UpdateBusiness {
  data: {
    image: string;
    name: string;
    id: number;
  }[];
}
