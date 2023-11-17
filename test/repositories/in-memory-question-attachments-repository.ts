import { QuestionAttachment } from "src/domain/forum/enterprise/entities/question-attachment";
import { QuestionAttachmentsRepository } from "src/domain/forum/application/repositories/question-attachments-repository";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  public async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  public async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    );
  }

  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  public async deleteManyByQuestionId(questionId: string): Promise<void> {
    const remainingAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = remainingAttachments;
  }
}
