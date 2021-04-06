import { AddProductDto } from 'src/basket/dto/add-product.dto';

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

export type ListProductInBasketResponse = AddProductDto[];
export type GetTotalPriceResponse =
  | number
  | {
      isSuccess: false;
      alternativeBasket: AddProductDto[];
    };
