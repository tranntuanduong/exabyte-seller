export interface ShopBanner {
  id: number;
  image: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  order: any;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: number;
  numberBanner: number;
  layoutImg: string;
  themeDemo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopTheme {
  id: number;
  createdAt: string;
  updatedAt: string;
  shopBanner: ShopBanner[];
  shop: any;
  theme: Theme;
  categories: Category[];
}
