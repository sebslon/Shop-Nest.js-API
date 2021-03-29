import { Inject, Injectable } from '@nestjs/common';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  ListProductInBasketResponse,
  RemoveProductFromBasketResponse,
} from 'src/interfaces/basket';
import { ShopService } from 'src/shop/shop.service';
import { AddProductDto } from './dto/add-product.dto';

@Injectable()
export class BasketService {
  private items: AddProductDto[] = [];

  constructor(@Inject(ShopService) private shopService: ShopService) {}

  listProducts(): ListProductInBasketResponse {
    return this.items;
  }

  addProduct(product: AddProductDto): AddProductToBasketResponse {
    const { name, count } = product;
    const invalidProductOrNotInStock =
      typeof name !== 'string' ||
      typeof count !== 'number' ||
      name === '' ||
      count < 1 ||
      !this.shopService.hasProduct(name);

    if (invalidProductOrNotInStock) {
      return { isSuccess: false };
    }

    this.items.push(product);
    return {
      isSuccess: true,
      index: this.items.length - 1,
    };
  }

  removeProduct(index: number): RemoveProductFromBasketResponse {
    const { items } = this;
    if (index < 0 || index >= items.length) {
      return { isSuccess: false };
    }

    items.splice(index, 1);

    return {
      isSuccess: true,
    };
  }

  getTotalPrice(): GetTotalPriceResponse {
    const taxAdded = 1.23;

    return this.items
      .map(
        (item) =>
          this.shopService.getPriceOfProduct(item.name) * item.count * taxAdded,
      )
      .reduce((prev, curr) => prev + curr, 0);
  }
}
