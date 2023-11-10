import { PaginationParams } from "@/core/repositories/pagination-params";

import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = [];

	public async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
	}

	public async delete(questionComment: QuestionComment): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id === questionComment.id);

		this.items.splice(itemIndex, 1);
	}

	public async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(item => item.id.toString() === id);

		if(!questionComment) {
			return null;
		}

		return questionComment;
	}

	public async findManyByQuestionId(
		questionId: string, { page }: PaginationParams
	): Promise<QuestionComment[]> {
		const questionComments = this.items.filter(item => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}
}