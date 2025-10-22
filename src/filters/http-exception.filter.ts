import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorDto } from '../dto/ai-question.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let code: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details;
      } else {
        message = exception.message;
      }

      code = this.getErrorCode(status);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Внутренняя ошибка сервера';
      code = 'INTERNAL_SERVER_ERROR';

      if (exception instanceof Error) {
        this.logger.error(
          `${exception.message}\n${exception.stack}`,
          exception.stack,
        );
      } else {
        this.logger.error('Неизвестная ошибка:', exception);
      }
    }

    const errorResponse: ErrorDto = {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Логируем ошибку
    this.logger.error(
      `${status} ${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
    );

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: HttpStatus): string {
    const errorCodes: Partial<Record<HttpStatus, string>> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
      [HttpStatus.NOT_ACCEPTABLE]: 'NOT_ACCEPTABLE',
      [HttpStatus.REQUEST_TIMEOUT]: 'REQUEST_TIMEOUT',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.GONE]: 'GONE',
      [HttpStatus.LENGTH_REQUIRED]: 'LENGTH_REQUIRED',
      [HttpStatus.PRECONDITION_FAILED]: 'PRECONDITION_FAILED',
      [HttpStatus.PAYLOAD_TOO_LARGE]: 'PAYLOAD_TOO_LARGE',
      [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'UNSUPPORTED_MEDIA_TYPE',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.NOT_IMPLEMENTED]: 'NOT_IMPLEMENTED',
      [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
      [HttpStatus.GATEWAY_TIMEOUT]: 'GATEWAY_TIMEOUT',
    };

    return errorCodes[status] || 'UNKNOWN_ERROR';
  }
}