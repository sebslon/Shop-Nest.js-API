import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CacheItem } from 'src/cache/cache-item.entity';

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler();
    const controllerName = context.getClass().name;
    const actionName = method.name;

    const cacheTimeInSecs = this.reflector.get<number>(
      'cacheTimeInSecs',
      method,
    );

    const cachedData = await CacheItem.findOne({
      where: {
        controllerName,
        actionName,
      },
    });

    const timeOut =
      +cachedData.createdAt + cacheTimeInSecs * 1000 > +new Date();

    if (cachedData) {
      if (timeOut) {
        //use cached data
        return of(JSON.parse(cachedData.dataJson));
      } else {
        //remove old cache data
        await cachedData.remove();
      }
    }

    return next.handle().pipe(
      tap(async (data) => {
        console.log(data);
        const newCachedData = new CacheItem();
        newCachedData.controllerName = controllerName;
        newCachedData.actionName = actionName;
        newCachedData.dataJson = JSON.stringify(data);
        await newCachedData.save();
      }),
    );
  }
}
