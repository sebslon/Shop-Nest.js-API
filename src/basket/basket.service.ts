import { forwardRef, Inject, Injectable } from '@nestjs/common';

import {
  AddProductToBasketResponse,
  GetBasketStatsResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
} from 'src/interfaces/basket';
import { MailService } from 'src/mail/mail.service';
import { ShopService } from 'src/shop/shop.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { getConnection } from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';
import { ItemInBasket } from './item-in-basket.entity';

@Injectable()
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
  ) {}

  async getProductsForAdmin(): Promise<ItemInBasket[]> {
    return ItemInBasket.find({
      relations: ['shopItem', 'user'],
    });
  }

  async getProductsInUserBasket(userId: string): Promise<ItemInBasket[]> {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return ItemInBasket.find({
      where: {
        user,
      },
      relations: ['shopItem'],
    });
  }

  async getStats(): Promise<GetBasketStatsResponse> {
    const {
      itemInBasketAvgPrice,
    } = await getConnection()
      .createQueryBuilder()
      .select('AVG(shopItem.price)', 'itemInBasketAvgPrice')
      .from(ItemInBasket, 'itemInBasket')
      .leftJoinAndSelect('itemInBasket.shopItem', 'shopItem')
      .getRawOne();

    const allItemsInBasket = await this.getProductsForAdmin();

    const baskets: {
      [userId: string]: number;
    } = {};

    for (const oneItemInBasket of allItemsInBasket) {
      baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;

      baskets[oneItemInBasket.user.id] +=
        oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
    }

    const basketValues = Object.values(baskets);

    const basketAvgTotalPrice =
      basketValues.reduce((prev, curr) => prev + curr, 0) / basketValues.length;

    return {
      itemInBasketAvgPrice,
      basketAvgTotalPrice,
    };
  }

  async addProduct(
    product: AddProductDto,
    user: User,
  ): Promise<AddProductToBasketResponse> {
    const { count, productId } = product;

    const shopItem = await this.shopService.getOneProduct(productId);

    const invalidData =
      typeof productId !== 'string' ||
      typeof count !== 'number' ||
      productId === '' ||
      count < 1 ||
      !shopItem;

    if (invalidData) {
      return { isSuccess: false };
    }

    const item = new ItemInBasket();
    item.count = count;

    await item.save();
    item.shopItem = shopItem;
    item.user = user;

    this.shopService.addBoughtCounter(productId);
    await item.save();

    // await this.mailService.sendMail(
    //   user.email,
    //   'Your Basket',
    //   `Added ${shopItem.name} to your basket.`,
    // );

    return {
      isSuccess: true,
      id: item.productId,
    };
  }

  async removeProduct(
    itemInBasketId: string,
    userId: string,
  ): Promise<RemoveProductFromBasketResponse> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const item = await ItemInBasket.findOne({
      where: {
        id: itemInBasketId,
        user,
      },
    });

    if (item) {
      await item.remove();
      return { isSuccess: true };
    }

    return { isSuccess: false };
  }

  async getTotalPrice(userId: string): Promise<GetTotalPriceResponse> {
    const taxAdded = 1.23;
    const items = await this.getProductsInUserBasket(userId);

    if (!items.every((item) => this.shopService.hasProduct(item.productId))) {
      const alternativeBasket = items.filter((item) =>
        this.shopService.hasProduct(item.productId),
      );

      return { isSuccess: false, alternativeBasket };
    }

    return (
      await Promise.all(
        items.map(async (item) => item.shopItem.price * item.count * taxAdded),
      )
    ).reduce((prev, curr) => prev + curr, 0);
  }

  async countPromo(userId: string): Promise<number> {
    return (await this.getTotalPrice(userId)) > 10 ? 1 : 0;
  }

  async clearBasket(userId: string) {
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new Error('User not found');
    }
    await ItemInBasket.delete({
      user,
    });
  }
}
