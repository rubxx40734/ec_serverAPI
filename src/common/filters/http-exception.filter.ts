// src/common/filters/all-exceptions.filter.ts (修改後的 catch 方法)

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. 判斷例外的類型，取得 HTTP 狀態碼
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error'; // 支援字串或字串陣列
    let code: string | undefined = undefined; // 💡 新增 code 欄位

    // 2. 核心邏輯：從 HttpException 中解析自訂訊息和 code
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // 嘗試從自訂物件中獲取 message 和 code
        const customResponse = exceptionResponse as {
          message?: string | string[];
          code?: string;
        };
        message = customResponse.message || message;
        code = customResponse.code;
      } else {
        // 如果 response 是純字串
        message = exceptionResponse as string;
      }
    }

    // 3. 建立我們自訂的、統一的錯誤回應格式
    const errorResponse = {
      status: false,
      message: message,
      // 💡 關鍵：只有當 code 存在時才加入這個欄位
      ...(code && { code }),
      data: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // 4. 設定 HTTP 狀態碼，並回傳 JSON
    response.status(status).json(errorResponse);
  }
}
