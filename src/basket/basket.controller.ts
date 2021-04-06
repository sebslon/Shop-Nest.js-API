import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  ListProductInBasketResponse,
  RemoveProductFromBasketResponse,
} from 'src/interfaces/basket';
import { BasketService } from './basket.service';
import { AddProductDto } from './dto/add-product.dto';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService: BasketService) {}

  @Get('/')
  async getAllProductsFromBasket(): Promise<ListProductInBasketResponse> {
    return this.basketService.getProductsInBasket();
  }

  @Post('/')
  async addProductToBasket(
    @Body() item: AddProductDto,
  ): Promise<AddProductToBasketResponse> {
    return await this.basketService.addProduct(item);
  }

  @Get('/total-price')
  async getTotalPrice(): Promise<GetTotalPriceResponse> {
    return this.basketService.getTotalPrice();
  }

  @Delete('/all')
  clearBasket() {
    this.basketService.clearBasket();
  }

  @Delete('/:id')
  async removeProductFromBasket(
    @Param('id') id: string,
  ): Promise<RemoveProductFromBasketResponse> {
    return this.basketService.removeProduct(id);
  }
}
