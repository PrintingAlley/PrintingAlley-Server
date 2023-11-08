import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';
import { DEFAULT_WIDTH } from 'src/config/constants';

@Injectable()
export class CloudflareService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
      endpoint: this.configService.get('R2_ENDPOINT'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async resizeAndUploadFile(
    fileBuffer: Buffer,
    fileName: string,
    width: number = DEFAULT_WIDTH,
    height?: number,
  ): Promise<string> {
    const {
      buffer: resizedBuffer,
      width: resizedWidth,
      height: resizedHeight,
    } = await this.resizeImage(fileBuffer, width, height);

    const resizedFileName = `${fileName}?width=${resizedWidth}&height=${resizedHeight}`;

    await this.uploadToR2(fileBuffer, fileName);
    await this.uploadToR2(resizedBuffer, resizedFileName);
    return this.buildFilePath(resizedFileName);
  }

  private async resizeImage(
    fileBuffer: Buffer,
    width: number,
    height?: number,
  ): Promise<{ buffer: Buffer; width: number; height: number }> {
    try {
      const sharpInstance = sharp(fileBuffer).resize(
        width,
        height || undefined,
      );
      const metadata = await sharpInstance.metadata();
      const resizedBuffer = await sharpInstance.toBuffer();

      return {
        buffer: resizedBuffer,
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      console.error('Failed to resize image:', error);
      throw new NotFoundException('Failed to resize image');
    }
  }

  private async uploadToR2(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<void> {
    try {
      await this.s3
        .upload({
          Bucket: this.configService.get('R2_BUCKET_NAME'),
          Key: fileName,
          Body: fileBuffer,
        })
        .promise();
    } catch (error) {
      console.error('Failed to upload to R2:', error);
      throw new NotFoundException('Failed to upload to R2');
    }
  }

  private buildFilePath(fileName: string): string {
    const publicDomain = this.configService.get('R2_PUBLIC_DOMAIN');
    return `${publicDomain}/${fileName}`;
  }
}
