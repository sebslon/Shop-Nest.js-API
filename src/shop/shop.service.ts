import * as path from 'path';
import * as fs from 'fs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { BasketService } from 'src/basket/basket.service';
import { newProductDto } from './dto/new-product.dto';
import { ShopItem } from './shop-item.entity';
import { MulterDiskUploadedFiles } from 'src/interfaces/files';
import {
  GetListOfProductsResponse,
  GetPaginatedListOfProductsResponse,
  IShopItem,
} from 'src/interfaces/shop';
import { storageDir } from 'src/utils/storage';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
  ) {}

  filter(shopItem: ShopItem) {
    const { id, price, description, name } = shopItem;
    return { id, price, description, name };
  }

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

  async createProduct(
    data: newProductDto,
    files: MulterDiskUploadedFiles,
  ): Promise<IShopItem> {
    const photo = files?.photo?.[0] ?? null;

    try {
      const shopItem = new ShopItem();
      shopItem.name = data.name;
      shopItem.description = data.description;
      shopItem.price = data.price;

      if (photo) {
        shopItem.photoFilename = photo.filename;
      }

      await shopItem.save();

      return this.filter(shopItem);
    } catch (e) {
      try {
        if (photo) {
          console.log('aaa');
          fs.unlinkSync(
            path.join(storageDir(), 'product-photos', photo.filename),
          );
        }
      } catch (e2) {
        //deleting file failed
      }

      throw e;
    }
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
  async getPhoto(id: string, res: any) {
    try {
      const product = await ShopItem.findOne(id);

      if (!product) {
        throw new Error('No object found!');
      }

      if (!product.photoFilename) {
        throw new Error("This entity doesn't have a photo!");
      }

      res.sendFile(product.photoFilename, {
        root: path.join(storageDir(), 'product-photos'),
      });
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
  }
}
