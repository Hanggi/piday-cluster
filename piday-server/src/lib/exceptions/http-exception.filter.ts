import { Response } from "express";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    console.log(exception instanceof HttpException);
    console.log(exceptionResponse.hasOwnProperty("message"));
    let messages = [];
    if (
      exception instanceof HttpException &&
      exceptionResponse.hasOwnProperty("message")
    ) {
      console.log("???");
      messages = exceptionResponse["message"];

      // 如果消息是数组，则可能来自 ValidationPipe
      if (Array.isArray(messages)) {
        messages = messages
          .map((message) => {
            if (typeof message === "object" && message.constraints) {
              // 返回每个验证错误的消息
              return Object.values(message.constraints);
            }
            return message;
          })
          .flat();
      }
    }

    console.log({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message:
        exceptionResponse ||
        messages ||
        exception.getResponse() ||
        exception.message,
      // path: request.url,
    });
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message:
        exceptionResponse ||
        messages ||
        exception.getResponse() ||
        exception.message,
      // path: request.url,
    });
  }
}
