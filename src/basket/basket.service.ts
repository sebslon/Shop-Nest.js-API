import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
} from 'src/interfaces/basket';
import { ShopService } from 'src/shop/shop.service';
import { AddProductDto } from './dto/add-product.dto';
import { ItemInBasket } from './item-in-basket.entity';

@Injectable()
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
  ) {}

  async getProductsInBasket(): Promise<ItemInBasket[]> {
    return ItemInBasket.find({
      relations: ['shopItem'],
    });
  }

  async addProduct(
    product: AddProductDto,
  ): Promise<AddProductToBasketResponse> {
    const { count, id } = product;

    const shopItem = await this.shopService.getOneProduct(id);

    const invalidProductDetailsOrNotInStock =
      typeof id !== 'string' ||
      typeof count !== 'number' ||
      id === '' ||
      count < 1 ||
      !shopItem;

    if (invalidProductDetailsOrNotInStock) {
      return { isSuccess: false };
    }

    const item = new ItemInBasket();
    item.count = count;

    await item.save();
    item.shopItem = shopItem;

    this.shopService.addBoughtCounter(id);
    await item.save();

    return {
      isSuccess: true,
      id: item.id,
    };
  }

  async removeProduct(id: string): Promise<RemoveProductFromBasketResponse> {
    const item = await ItemInBasket.findOne(id);

    if (item) {
      await item.remove();
      return { isSuccess: true };
    }

    return { isSuccess: false };
  }

  async getTotalPrice(): Promise<GetTotalPriceResponse> {
    const taxAdded = 1.23;
    const items = await this.getProductsInBasket();

    if (!items.every((item) => this.shopService.hasProduct(item.id))) {
      const alternativeBasket = items.filter((item) =>
        this.shopService.hasProduct(item.id),
      );

      return { isSuccess: false, alternativeBasket };
    }

    return (
      await Promise.all(
        items.map(async (item) => item.shopItem.price * item.count * taxAdded),
      )
    ).reduce((prev, curr) => prev + curr, 0);
  }

  async countPromo(): Promise<number> {
    return (await this.getTotalPrice()) > 10 ? 1 : 0;
  }

  async clearBasket() {
    await ItemInBasket.delete({});
  }
}
