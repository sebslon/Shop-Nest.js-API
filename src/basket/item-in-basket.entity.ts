import { ShopItem } from 'src/shop/shop-item.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';

@Entity()
export class ItemInBasket extends BaseEntity implements AddProductDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @OneToOne((type) => ShopItem, (entity) => entity.itemInBasket)
  @JoinColumn()
  shopItem: ShopItem;
}
