import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import {
  UploadParams,
  Uploader,
} from "src/domain/forum/application/storage/uploader";

import { EnvService } from "../env/env.service";

@Injectable()
export class TebiStorage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: "https://s3.tebi.io",
      region: "global",
      credentials: {
        accessKeyId: envService.get("STORAGE_ACCESS_KEY"),
        secretAccessKey: envService.get("STORAGE_SECRET_KEY"),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get("STORAGE_BUCKET_NAME"),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return { url: uniqueFileName };
  }
}
