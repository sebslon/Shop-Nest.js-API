import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  count: number;
}
