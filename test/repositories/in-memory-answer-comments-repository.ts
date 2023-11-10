import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = [];

	public async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
	}

	public async delete(answerComment: AnswerComment): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id === answerComment.id);

		this.items.splice(itemIndex, 1);
	}

	public async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find(item => item.id.toString() === id);

		if(!answerComment) {
			return null;
		}

		return answerComment;
	}

	public async findManyByAnswerId(
		answerId: string, { page }: PaginationParams
	): Promise<AnswerComment[]> {
		const answerComments = this.items.filter(item => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20);

		return answerComments;
	}
}