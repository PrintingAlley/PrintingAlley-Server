import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseOptionalArrayPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (value === undefined) {
      return undefined;
    }

    if (!Array.isArray(value)) {
      if (typeof value === 'string') {
        return [value];
      }
      throw new BadRequestException(
        'Validation failed (parsable array expected)',
      );
    }

    return value;
  }
}
