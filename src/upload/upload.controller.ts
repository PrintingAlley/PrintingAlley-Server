import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudflareService } from './cloudflare.service';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  UploadMultipleResponseDto,
  UploadResponseDto,
} from './dto/upload-response.dto';
import { v4 as uuidv4 } from 'uuid';

@UseGuards(AuthGuard('jwt'))
@Controller('upload')
@ApiTags('Upload')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {JWT 토큰}',
})
export class UploadController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Post()
  @ApiOperation({
    summary: '파일 업로드',
    description: '파일을 업로드하는 API입니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: '파일 업로드 성공',
    type: UploadResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uniqueFileName = `${uuidv4()}_${file.originalname}`;
    const url = await this.cloudflareService.resizeAndUploadFile(
      file.buffer,
      uniqueFileName,
    );
    return { url };
  }

  @Post('multiple')
  @ApiOperation({
    summary: '파일 다중 업로드',
    description: '파일을 다중 업로드하는 API입니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: '파일 다중 업로드 성공',
    type: UploadMultipleResponseDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = [];
    for (const file of files) {
      const uniqueFileName = `${uuidv4()}_${file.originalname}`;
      const url = await this.cloudflareService.resizeAndUploadFile(
        file.buffer,
        uniqueFileName,
      );
      urls.push(url);
    }
    return { urls };
  }
}
