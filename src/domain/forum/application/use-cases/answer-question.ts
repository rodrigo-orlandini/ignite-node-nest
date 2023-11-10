import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";

import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";

import { AnswersRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
	attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, {
	answer: Answer;
}>

export class AnswerQuestionUseCase {
	constructor (
		private answersRepository: AnswersRepository
	) {}

	public async execute({ 
		instructorId, questionId, content, attachmentsIds
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(instructorId),
			questionId: new UniqueEntityID(questionId)
		});

		const answerAttachments = attachmentsIds.map(attachmentId => 
			AnswerAttachment.create({ 
				attachmentId: new UniqueEntityID(attachmentId), 
				answerId: answer.id 
			})
		);

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}