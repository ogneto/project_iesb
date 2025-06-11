import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    console.log(`TimingConnectionInterceptor's working`);

    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();
        const elipsedTime = finalTime - startTime;
        console.log(`This was executed in ${elipsedTime} milliseconds`);
      }),
    );
  }
}
