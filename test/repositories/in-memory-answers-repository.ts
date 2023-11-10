import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";

import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor (
		private answerAttachmentsRepository: AnswerAttachmentsRepository
	) {}

	public async create(answer: Answer): Promise<void> {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	public async save(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id === answer.id);

		this.items[itemIndex] = answer;

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	public async delete(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id === answer.id);

		this.items.splice(itemIndex, 1);
		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
	}

	public async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find(item => item.id.toString() === id);

		if(!answer) {
			return null;
		}

		return answer;
	}

	public async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
		const answers = this.items.filter(item => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return answers;
	}
}