export interface IShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type GetListOfProductsResponse = IShopItem[];

export type GetOneProductResponse = IShopItem;

export type CreateProductResponse = IShopItem;