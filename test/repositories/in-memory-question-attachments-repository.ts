import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
	public items: QuestionAttachment[] = [];

	public async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		const questionAttachments = this.items.filter(item => item.questionId.toString() === questionId);

		return questionAttachments;
	}

	public async deleteManyByQuestionId(questionId: string): Promise<void> {
		const remainingAttachments = this.items.filter(item => item.questionId.toString() !== questionId);

		this.items = remainingAttachments;
	}
}