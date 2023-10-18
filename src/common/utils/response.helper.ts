import { CommonResponseDto } from '../dto/common-response.dto';

export function createResponse(
  statusCode: number,
  message: string,
  dataId?: number,
): CommonResponseDto {
  return { statusCode, message, dataId };
}
