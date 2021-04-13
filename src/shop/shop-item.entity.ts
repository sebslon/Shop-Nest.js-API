import { ItemInBasket } from 'src/basket/item-in-basket.entity';
import { IShopItem } from 'src/interfaces/shop';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemDetails } from './shop-item-details.entity';
import { ShopSet } from './shop-set.entity';

@Entity()
export class ShopItem extends BaseEntity implements IShopItem {
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

  @Column({
    default: null,
    nullable: true,
  })
  photoFilename: string;

  @OneToOne(() => ShopItemDetails)
  @JoinColumn()
  details: ShopItemDetails;

  @ManyToOne((type) => ShopItem, (entity) => entity.subShopItems)
  mainShopItem: ShopItem;

  @OneToMany((type) => ShopItem, (entity) => entity.mainShopItem)
  subShopItems: ShopItem[];

  @ManyToMany((type) => ShopSet, (entity) => entity.items)
  @JoinTable()
  sets: ShopSet[];

  @OneToMany((type) => ItemInBasket, (entity) => entity.shopItem)
  itemsInBasket: ItemInBasket[];
}
