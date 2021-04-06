import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BasketService } from 'src/basket/basket.service';
import {
  GetListOfProductsResponse,
  GetPaginatedListOfProductsResponse,
} from 'src/interfaces/shop';
import { getConnection } from 'typeorm';
import { ShopItemDetails } from './shop-item-details.entity';
import { ShopItem } from './shop-item.entity';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
  ) {}

  async getProducts(
    currentPage = 1,
  ): Promise<GetPaginatedListOfProductsResponse> {
    const maxPerPage = 3;

    const [items, count] = await ShopItem.findAndCount({
      relations: ['details', 'sets'],
      skip: maxPerPage * (currentPage - 1),
      take: maxPerPage,
    });

    const pagesCount = Math.ceil(count / maxPerPage);

    return {
      items,
      pagesCount,
    };
  }

  async hasProduct(id: string): Promise<boolean> {
    return (await this.getProducts()).items.some((item) => item.id === id);
  }

  async getPriceOfProduct(id: string): Promise<number> {
    return (await this.getProducts()).items.find((item) => item.id === id)
      .price;
  }

  async getOneProduct(id: string): Promise<ShopItem> {
    return ShopItem.findOneOrFail(id);
  }

  async removeProduct(id: string) {
    await ShopItem.delete(id);
  }

  async addBoughtCounter(id: string) {
    // await this.shopItemRepository.update(id, {
    //   wasEverBought: true,
    // });
    await ShopItem.update(id, {
      wasEverBought: true,
    });

    const item = await ShopItem.findOneOrFail(id);

    item.boughtCounter++;

    await item.save();
  }

  async createProduct(data): Promise<ShopItem> {
    const newItem = new ShopItem();
    newItem.price = 100;
    newItem.name = 'Spodnie';
    newItem.description = 'Fajne spodnie';

    await newItem.save();

    const details = new ShopItemDetails();
    details.color = 'niebieskie';
    details.width = 20;

    await details.save();

    newItem.details = details;

    await newItem.save();

    return newItem;
  }

  async findProducts(searchTerm: string): Promise<GetListOfProductsResponse> {
    const count = await getConnection()
      .createQueryBuilder()
      .select('COUNT(shopItem.id)', 'count')
      .from(ShopItem, 'shopItem')
      .getRawOne();

    return await getConnection()
      .createQueryBuilder()
      .select('shopItem')
      .from(ShopItem, 'shopItem')
      .where('shopItem.description LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('shopItem.id', 'ASC')
      .addOrderBy('price', 'ASC')
      .skip(10)
      .take(5)
      .getMany();
    //   return await ShopItem.find({
    //     order: {
    //       price: 'DESC',
    //     },
    //     where: [
    //       { price: LessThan(1000) && MoreThan(0) },
    //       { price: Between(0, 1000) },
    //       { description: Like(`%${searchTerm}%`) },
    //     ],
    //   });
    // }
  }
}
