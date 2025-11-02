import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 1. @Catch() 裝飾器，如果不帶參數，會捕捉所有類型的例外
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 2. 判斷例外的類型，取得 HTTP 狀態碼和錯誤訊息
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message // 取得我們在 Guard 中自訂的訊息
        : 'Internal server error';

    // 3. 建立我們自訂的、統一的錯誤回應格式
    const errorResponse = {
      status: false,
      message: message,
      data: null, // 錯誤時，data 欄位固定為 null
      path: request.url, // 附加上請求的路徑
      timestamp: new Date().toISOString(), // 附加上時間戳
    };

    // 4. 設定 HTTP 狀態碼，並回傳 JSON
    response.status(status).json(errorResponse);
  }
}
