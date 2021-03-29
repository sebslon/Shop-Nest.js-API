import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopController } from './shop/shop.controller';

@Module({
  imports: [],
  controllers: [AppController, ShopController],
  providers: [AppService],
})
export class AppModule {}
