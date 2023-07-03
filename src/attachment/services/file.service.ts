import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from '../../common/services/custom-logger.service';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  private s3BucketName: string;
  private s3Url: string;

  constructor(
    configService: ConfigService,
    private customLogger: CustomLogger,
  ) {
    const region = configService.get('aws.region');
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: configService.get('aws.accessKeyId'),
        secretAccessKey: configService.get('aws.secretAccessKey'),
      },
    });
    this.s3BucketName = configService.get('aws.bucket');
    this.s3Url = `https://${this.s3BucketName}.s3.${region}.amazonaws.com`;
    this.customLogger.setContext(FileService.name);
  }

  async upload(file: Express.Multer.File) {
    try {
      const date = new Date().toISOString();
      const key = `temp/${date}${file.originalname}`;
      const input = {
        Body: file.buffer,
        Bucket: this.s3BucketName,
        Key: key,
        ACL: 'public-read',
      };
      const command = new PutObjectCommand(input);
      await this.s3Client.send(command);
      return `${this.s3Url}/${key}`;
    } catch (error) {
      this.customLogger.error(error);
    }
  }

  async move(url: string) {
    try {
      const source = url.replace(`${this.s3Url}/`, '');
      const key = source.replace('temp/', '');
      const copyCommand = new CopyObjectCommand({
        Bucket: this.s3BucketName,
        CopySource: `${this.s3BucketName}/${source}`,
        Key: key,
        ACL: 'public-read',
      });
      await this.s3Client.send(copyCommand);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.s3BucketName,
        Key: source,
      });
      await this.s3Client.send(deleteCommand);
      return `${this.s3Url}/${key}`;
    } catch (error) {
      this.customLogger.error(error);
    }
  }
}
