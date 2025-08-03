import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    // Log 400 and 401 errors with detailed information
    if (
      status === HttpStatus.BAD_REQUEST ||
      status === HttpStatus.UNAUTHORIZED
    ) {
      this.logger.error(
        `HTTP ${status} Error - ${request.method} ${request.url}`,
        {
          statusCode: status,
          method: request.method,
          url: request.url,
          body: request.body,
          headers: request.headers,
          query: request.query,
          params: request.params,
          timestamp: new Date().toISOString(),
          message: message,
          stack: exception instanceof Error ? exception.stack : undefined,
        }
      );
    }

    // Log other errors at appropriate levels
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error - ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception
      );
    } else if (status >= 400) {
      this.logger.warn(
        `HTTP ${status} Error - ${request.method} ${request.url}: ${
          typeof message === "string" ? message : JSON.stringify(message)
        }`
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
