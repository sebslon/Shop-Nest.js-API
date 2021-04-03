export interface IShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type GetListOfProductsResponse = IShopItem[];

export type GetOneProductResponse = IShopItem;

export type CreateProductResponse = IShopItem;

export interface GetPaginatedListOfProductsResponse {
  items: IShopItem[];
  pagesCount: number;
}
