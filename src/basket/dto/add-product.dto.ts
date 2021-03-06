import { IsNotEmpty } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  count: number;
}
