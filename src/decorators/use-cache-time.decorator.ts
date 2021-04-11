import { SetMetadata } from '@nestjs/common';

export const UseCacheTime = (cacheTimeInSeconds: number) =>
  SetMetadata('cacheTimeInSecs', cacheTimeInSeconds);
