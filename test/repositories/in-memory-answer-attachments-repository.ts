import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
	public items: AnswerAttachment[] = [];

	public async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachments = this.items.filter(item => item.answerId.toString() === answerId);

		return answerAttachments;
	}

	public async deleteManyByAnswerId(answerId: string): Promise<void> {
		const remainingAttachments = this.items.filter(item => item.answerId.toString() !== answerId);

		this.items = remainingAttachments;
	}
}