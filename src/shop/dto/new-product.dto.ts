import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class newProductDto {
  // @IsNotEmpty()
  @IsString()
  name: string;

  // @IsNotEmpty()
  @IsString()
  description: string;

  // @IsNotEmpty()
  @IsNumber()
  price: number;
}
