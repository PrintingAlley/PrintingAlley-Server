import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

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

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    await this.s3
      .upload({
        Bucket: this.configService.get('R2_BUCKET_NAME'),
        Key: fileName,
        Body: fileBuffer,
      })
      .promise();

    const publicDomain = this.configService.get('R2_PUBLIC_DOMAIN');
    const filePath = `${publicDomain}/${fileName}`;

    return filePath;
  }
}
