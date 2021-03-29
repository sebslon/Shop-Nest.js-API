export interface ShopItem {
  name: string;
  description: string;
  price: number;
}

export type GetListOfProductsResponse = ShopItem[];