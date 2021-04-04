import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemDetails } from './shop-item-details.entity';

@Entity()
export class ShopItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    type: 'text',
    default: '',
  })
  description: string;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
  })
  price: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: 0,
  })
  boughtCounter: number;

  @Column({
    default: false,
  })
  wasEverBought: boolean;

  @OneToOne(() => ShopItemDetails)
  @JoinColumn()
  details: ShopItemDetails;
}
