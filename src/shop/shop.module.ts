import { forwardRef, Module } from '@nestjs/common';
import { BasketModule } from 'src/basket/basket.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [forwardRef(() => BasketModule)],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
