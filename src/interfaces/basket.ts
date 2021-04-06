export type AddProductToBasketResponse =
  | {
      isSuccess: boolean;
      id: string;
    }
  | {
      isSuccess: false;
    };

export interface RemoveProductFromBasketResponse {
  isSuccess: boolean;
}

export interface OneItemInBasket {
  productId: string;
  count: number;
}

export type GetProductsFromBasketResponse = OneItemInBasket[];
export type GetTotalPriceResponse =
  | number
  | {
      isSuccess: false;
      alternativeBasket: OneItemInBasket[];
    };

export interface GetBasketStatsResponse {
  itemInBasketAvgPrice: number;
  basketAvgTotalPrice: number;
}
