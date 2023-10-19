import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const formattedResponse: CommonResponseDto = {
      statusCode: status,
      message:
        typeof errorResponse === 'object'
          ? errorResponse['message'] || 'Error'
          : errorResponse,
    };

    response.status(status).json(formattedResponse);
  }
}
