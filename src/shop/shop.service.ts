import { Injectable } from '@nestjs/common';
import { GetListOfProductsResponse, ShopItem } from 'src/interfaces/shop';

@Injectable()
export class ShopService {
  private items: ShopItem[] = [
    { name: 'T-Shirt', price: 20, description: 'Fajny opis' },
    { name: 'T-Shirt', price: 20, description: 'Fajny opis' },
    { name: 'T-Shirt', price: 20, description: 'Fajny opis' },
  ];

  getProducts(): GetListOfProductsResponse {
    return this.items;
  }

  hasProduct(name: string): boolean {
    return this.getProducts().some((item) => item.name === name);
  }

  getPriceOfProduct(name: string): number {
    return this.getProducts().find(item => item.name === name).price;
  }
}
