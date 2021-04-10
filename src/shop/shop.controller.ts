import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ShopService } from './shop.service';

import {
  CreateProductResponse,
  GetListOfProductsResponse,
  GetOneProductResponse,
  GetPaginatedListOfProductsResponse,
} from 'src/interfaces/shop';
import { newProductDto } from './dto/new-product.dto';
@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/testerror')
  test() {
    throw new Error('');
  }

  @Get('/:pageNumber')
  getAllItems(
    @Param('pageNumber') pageNumber: string,
  ): Promise<GetPaginatedListOfProductsResponse> {
    return this.shopService.getProducts(Number(pageNumber));
  }

  @Get('/find/:searchTerm')
  testFindItem(
    @Param('searchTerm') searchTerm: string,
  ): Promise<GetListOfProductsResponse> {
    return this.shopService.findProducts(searchTerm);
  }

  @Get('/:id')
  getOneProduct(@Param('id') id: string): Promise<GetOneProductResponse> {
    return this.shopService.getOneProduct(id);
  }

  @Delete('/:id')
  removeProduct(@Param('id') id: string) {
    return this.shopService.removeProduct(id);
  }

  @Post('/')
  createNewProduct(
    @Body() data: newProductDto,
  ): Promise<CreateProductResponse> {
    return this.shopService.createProduct(data);
  }
}
