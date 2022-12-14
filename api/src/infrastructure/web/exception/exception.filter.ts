import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpServer,
} from '@nestjs/common';

import { Response } from 'express';
import { BaseException, ExceptionCode } from '../../../error';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { MessageCode } from '../../../message';
import { BaseExceptionFilter } from '@nestjs/core';
import { DomainException } from '../../../domain/domain.exception';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  constructor(applicationRef: HttpServer) {
    super(applicationRef);
  }

  catch(exception: BaseException, host: ArgumentsHost): any {
    if (exception instanceof BadRequestException) {
      return this.reply(host, exception.getResponse()['message'], 400);
    }
    if (exception instanceof HttpException) {
      return this.reply(
        host,
        (<HttpException>exception).message,
        (<HttpException>exception).getStatus(),
      );
    }
    if (!(exception instanceof BaseException)) {
      return super.handleUnknownError(exception, host, this.applicationRef);
    }
    const { sourceArea, args, messageKey } = exception.messageProps;
    const exceptionCode =
      exception instanceof DomainException
        ? ExceptionCode.BAD_REQUEST
        : exception.exceptionCode;
    const i18n = getI18nContextFromArgumentsHost(host);
    const messageCode = messageKey || MessageCode.UNKNOWN_ERROR;
    return this.reply(
      host,
      i18n.t(`${sourceArea}.${messageKey}`, { args }),
      exceptionCode,
      messageCode,
    );
  }

  protected reply(
    host: ArgumentsHost,
    message: string,
    statusCode: ExceptionCode,
    messageCode?: MessageCode,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response
      .status(statusCode)
      .json(this.buildResponse(statusCode, message, messageCode));
  }

  protected buildResponse(
    statusCode: ExceptionCode,
    message: string,
    messageCode?: MessageCode,
  ): ErrorResponse {
    return {
      timestamp: new Date().toISOString(),
      message,
      statusCode,
      messageCode,
    };
  }
}

export interface ErrorResponse {
  statusCode: ExceptionCode;
  timestamp: string;
  message: string;
  messageCode?: MessageCode;
}
