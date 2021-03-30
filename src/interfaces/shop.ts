export interface ShopItem {
  name: string;
  description: string;
  count: number;
  price: number;
}

export type GetListOfProductsResponse = ShopItem[];
