import { Either, left, right } from "@/core/either";

import { AnswersRepository } from "../repositories/answers-repository";

import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";

interface DeleteAnswerUseCaseRequest {
	authorId: string;
	questionId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, object>

export class DeleteAnswerUseCase {
	constructor (
		private answersRepository: AnswersRepository
	) {}

	public async execute({ authorId, questionId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const question = await this.answersRepository.findById(questionId);

		if(!question) {
			return left(new ResourceNotFoundError());
		}

		if(authorId !== question.authorId.toString()) {
			return left(new NotAllowedError());
		}

		await this.answersRepository.delete(question);

		return right({});
	}
}