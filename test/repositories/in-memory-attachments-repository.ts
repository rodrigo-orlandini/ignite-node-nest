import { AttachmentsRepository } from "src/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "src/domain/forum/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment);
  }
}
