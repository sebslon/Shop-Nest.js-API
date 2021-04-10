import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PasswordProtectGuard } from 'src/guards/password-protect.guard';
import { UsePassword } from '../decorators/use-password.decorator';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  GetProductsFromBasketResponse,
  RemoveProductFromBasketResponse,
  GetBasketStatsResponse,
} from 'src/interfaces/basket';
import { BasketService } from './basket.service';
import { AddProductDto } from './dto/add-product.dto';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService: BasketService) {}

  @Get('/admin')
  getBasketForAdmin(): Promise<GetProductsFromBasketResponse> {
    return this.basketService.getProductsForAdmin();
  }

  @Get('/stats')
  @UsePassword('ADMIN')
  @UseGuards(PasswordProtectGuard)
  getStats(): Promise<GetBasketStatsResponse> {
    return this.basketService.getStats();
  }

  @Get('/:userId')
  getAllUserProductsFromBasket(
    @Param('userId') userId: string,
  ): Promise<GetProductsFromBasketResponse> {
    return this.basketService.getProductsInUserBasket(userId);
  }

  @Post('/')
  addProductToBasket(
    @Body() item: AddProductDto,
  ): Promise<AddProductToBasketResponse> {
    return this.basketService.addProduct(item);
  }

  @Get('/total-price/:userId')
  getTotalPrice(
    @Param('userId') userId: string,
  ): Promise<GetTotalPriceResponse> {
    return this.basketService.getTotalPrice(userId);
  }

  @Delete('/all/:userId')
  clearBasket(@Param('userId') userId: string) {
    this.basketService.clearBasket(userId);
  }

  @Delete('/:itemInBasketId/:userId')
  removeProductFromBasket(
    @Param('itemInBasketId') itemInBasketId: string,
    @Param('userId') userId: string,
  ): Promise<RemoveProductFromBasketResponse> {
    return this.basketService.removeProduct(itemInBasketId, userId);
  }
}
