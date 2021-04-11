import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler();

    const cachedData = this.reflector.get<any>('cacheData', method);
    const cachedTime = this.reflector.get<Date>('cacheTime', method);
    const timeOut = +cachedTime + 10 * 1000 > +new Date();

    if (cachedData && timeOut) {
      //use cached data
      return of(cachedData);
    } else {
      return next.handle().pipe(
        tap((data) => {
          Reflect.defineMetadata('cacheData', data, method);
          Reflect.defineMetadata('cacheTime', new Date(), method);
        }),
      );
    }
  }
}
