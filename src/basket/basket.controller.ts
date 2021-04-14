import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
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
import { TimeoutInterceptor } from 'src/interceptors/timeout.interceptor';
import { MyCacheInterceptor } from 'src/interceptors/mycache-interceptor';
import { UseCacheTime } from 'src/decorators/use-cache-time.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { User } from 'src/user/entities/user.entity';

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
  @UseInterceptors(TimeoutInterceptor, MyCacheInterceptor)
  @UseCacheTime(10)
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
  @UseGuards(AuthGuard('jwt'))
  addProductToBasket(
    @Body() item: AddProductDto,
    @UserObj() user: User,
  ): Promise<AddProductToBasketResponse> {
    return this.basketService.addProduct(item, user);
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
