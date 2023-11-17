import { randomUUID } from "node:crypto";

import {
  UploadParams,
  Uploader,
} from "src/domain/forum/application/storage/uploader";

interface Upload {
  fileName: string;
  url: string;
}

export class StubUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
