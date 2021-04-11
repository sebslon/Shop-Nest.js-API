import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasketController } from './basket/basket.controller';
import { BasketModule } from './basket/basket.module';
import { BasketService } from './basket/basket.service';
import { ShopController } from './shop/shop.controller';
import { ShopModule } from './shop/shop.module';
import { ShopService } from './shop/shop.service';
import { UserModule } from './users/user.module';
import { CacheModule } from './cache/cache.module';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    BasketModule,
    ShopModule,
    UserModule,
    CacheModule,
    CronModule,
    MailModule,
  ],
  controllers: [AppController, ShopController, BasketController],
  providers: [AppService, ShopService, BasketService],
})
export class AppModule {}
