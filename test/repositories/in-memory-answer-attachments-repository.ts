import { AnswerAttachment } from "src/domain/forum/enterprise/entities/answer-attachment";
import { AnswerAttachmentsRepository } from "src/domain/forum/application/repositories/answer-attachments-repository";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  public async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  public async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    );
  }

  public async findManyByAnswerId(
    answerId: string,
  ): Promise<AnswerAttachment[]> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    );

    return answerAttachments;
  }

  public async deleteManyByAnswerId(answerId: string): Promise<void> {
    const remainingAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    );

    this.items = remainingAttachments;
  }
}
