import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { UploadAttachmentUseCase } from "src/domain/forum/application/use-cases/upload-attachment";
import { InvalidAttachmentTypeError } from "src/domain/forum/application/use-cases/errors/invalid-attachment-type-error";

@Controller("/attachments")
export class UploadAttachmentController {
  constructor(private uploadAttachment: UploadAttachmentUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2 Mb
          new FileTypeValidator({ fileType: ".(png|jpg|jpeg|pdf)" }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const response = await this.uploadAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (response.isLeft()) {
      const error = response.value;

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const attachment = response.value.attachment;

    return { attachmentId: attachment.id.toString() };
  }
}
