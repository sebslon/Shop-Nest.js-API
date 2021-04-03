import { forwardRef, Inject, Injectable } from '@nestjs/common';
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

  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
  ) {}

  listProducts(): ListProductInBasketResponse {
    return this.items;
  }

  addProduct(product: AddProductDto): AddProductToBasketResponse {
    const { name, count, id } = product;
    const invalidProductDetailsOrNotInStock =
      typeof name !== 'string' ||
      typeof count !== 'number' ||
      name === '' ||
      count < 1 ||
      !this.shopService.hasProduct(name);

    if (invalidProductDetailsOrNotInStock) {
      return { isSuccess: false };
    }

    this.items.push(product);
    this.shopService.addBoughtCounter(id);

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

  async getTotalPrice(): Promise<GetTotalPriceResponse> {
    const taxAdded = 1.23;

    if (!this.items.every((item) => this.shopService.hasProduct(item.name))) {
      const alternativeBasket = this.items.filter((item) =>
        this.shopService.hasProduct(item.name),
      );

      return { isSuccess: false, alternativeBasket };
    }

    return (
      await Promise.all(
        this.items.map(
          async (item) =>
            (await this.shopService.getPriceOfProduct(item.name)) *
            item.count *
            taxAdded,
        ),
      )
    ).reduce((prev, curr) => prev + curr, 0);
  }

  async countPromo(): Promise<number> {
    return (await this.getTotalPrice()) > 10 ? 1 : 0;
  }
}
