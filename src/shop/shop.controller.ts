import { Controller, Get, Inject } from '@nestjs/common';
import { ShopService } from './shop.service';

import { GetListOfProductsResponse } from 'src/interfaces/shop';
@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/')
  getAllItems(): GetListOfProductsResponse {
    return this.shopService.getProducts();
  }
}
