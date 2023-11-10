import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Answer } from "../../enterprise/entities/answer";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";

import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";

import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";

interface EditAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
	attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
	answer: Answer;
}>

export class EditAnswerUseCase {
	constructor (
		private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository
	) {}

	public async execute({
		authorId, answerId, content, attachmentsIds 
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if(!answer) {
			return left(new ResourceNotFoundError());
		}

		if(authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError());
		}

		const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId);
		const answerAttachmentsList = new AnswerAttachmentList(currentAnswerAttachments);

		const answerAttachments = attachmentsIds.map(attachmentId => 
			AnswerAttachment.create({ 
				attachmentId: new UniqueEntityID(attachmentId), 
				answerId: answer.id 
			})
		);

		answerAttachmentsList.update(answerAttachments);

		answer.content = content;
		answer.attachments = answerAttachmentsList;

		await this.answersRepository.save(answer);

		return right({ answer });
	}
}