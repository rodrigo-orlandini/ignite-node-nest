import { UploadAttachmentUseCase } from "./upload-attachment";

import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { StubUploader } from "test/storage/stub-uploader";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

let sut: UploadAttachmentUseCase;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let stubUploader: StubUploader;

describe("Upload Attachment Use Case", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    stubUploader = new StubUploader();

    sut = new UploadAttachmentUseCase(
      inMemoryAttachmentsRepository,
      stubUploader,
    );
  });

  it("should be able to upload an attachment", async () => {
    const response = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(stubUploader.uploads).toHaveLength(1);
    expect(stubUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  it("should be not able to upload an attachment with invalid mimetype", async () => {
    const response = await sut.execute({
      fileName: "profile.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
