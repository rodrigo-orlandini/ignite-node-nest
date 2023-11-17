import { Injectable } from "@nestjs/common";

import { Either, left, right } from "src/core/either";

import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";

import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

interface UploadAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  public async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    const fileTypeRegex = /^(image\/(jpeg|png))$|^application\/pdf$/;

    if (!fileTypeRegex.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
