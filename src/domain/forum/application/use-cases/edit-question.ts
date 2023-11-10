import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Question } from "../../enterprise/entities/question";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";

import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";

import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
	question: Question;
}>;

export class EditQuestionUseCase {
	constructor (
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository
	) {}

	public async execute({ 
		authorId, questionId, title, content, attachmentsIds
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if(!question) {
			return left(new ResourceNotFoundError());
		}

		if(authorId !== question.authorId.toString()) {
			return left(new ResourceNotFoundError());
		}

		const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId);
		const questionAttachmentsList = new QuestionAttachmentList(currentQuestionAttachments);

		const questionAttachments = attachmentsIds.map(attachmentId => 
			QuestionAttachment.create({ 
				attachmentId: new UniqueEntityID(attachmentId), 
				questionId: question.id 
			})
		);

		questionAttachmentsList.update(questionAttachments);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentsList;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}