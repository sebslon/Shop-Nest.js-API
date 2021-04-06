import { IsNotEmpty } from 'class-validator';

export class newProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;
}
