import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the data already has a specific structure, return it as is
        if (data && (data.data !== undefined || data.meta !== undefined)) {
          return data;
        }

        // Otherwise, wrap it in a standardized format
        return {
          data,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      })
    );
  }
}
