import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItem } from './shop-item.entity';

@Entity()
export class ShopItemDetails extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 60,
  })
  color: string;

  @Column()
  width: number;

  @OneToOne(() => ShopItem)
  shopItem: ShopItem;
}
