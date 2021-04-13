import * as path from 'path';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ShopService } from './shop.service';
import { newProductDto } from './dto/new-product.dto';
import { multerStorage, storageDir } from 'src/utils/storage';
import { MulterDiskUploadedFiles } from 'src/interfaces/files';
import {
  CreateProductResponse,
  GetListOfProductsResponse,
  GetOneProductResponse,
  GetPaginatedListOfProductsResponse,
} from 'src/interfaces/shop';

@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/testerror')
  test() {
    throw new Error('');
  }

  @Get('/photo/:id')
  async getPhoto(@Param('id') id: string, @Res() res: any): Promise<any> {
    return this.shopService.getPhoto(id, res);
  }

  @Get('/:pageNumber')
  getAllItems(
    @Param('pageNumber') pageNumber: string,
  ): Promise<GetPaginatedListOfProductsResponse> {
    return this.shopService.getProducts(Number(pageNumber));
  }

  @Get('/find/:searchTerm')
  testFindItem(
    @Param('searchTerm') searchTerm: string,
  ): Promise<GetListOfProductsResponse> {
    return this.shopService.findProducts(searchTerm);
  }

  @Get('/:id')
  getOneProduct(@Param('id') id: string): Promise<GetOneProductResponse> {
    return this.shopService.getOneProduct(id);
  }

  @Delete('/:id')
  removeProduct(@Param('id') id: string) {
    return this.shopService.removeProduct(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], {
      storage: multerStorage(path.join(storageDir(), 'product-photos')),
    }),
  )
  @Post('/')
  createNewProduct(
    @Body() data: newProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<CreateProductResponse> {
    return this.shopService.createProduct(data, files);
  }
}
