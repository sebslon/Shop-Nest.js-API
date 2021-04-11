import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { ShopModule } from 'src/shop/shop.module';
import { UserModule } from 'src/users/user.module';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';

@Module({
  imports: [
    forwardRef(() => ShopModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
