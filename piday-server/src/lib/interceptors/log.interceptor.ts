import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap({
        next: (response: any) => {
          const delay = Date.now() - now;
          // 记录请求信息和响应时间
          this.logger.log(`${method} ${url} Response time: ${delay}ms`);
        },
        error: (error) => {
          // 错误处理
          this.logger.error(`${method} ${url} Error: ${error.message}`);
        },
      }),
    );
  }
}
