import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";

import { NotAllowedError } from "../../../../core/errors/not-allowed-error";

let sut: ChooseQuestionBestAnswerUseCase;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;

describe("Choose Question Best Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);

		sut = new ChooseQuestionBestAnswerUseCase(inMemoryAnswersRepository, inMemoryQuestionsRepository);
	});

	it("should be able to choose the best answer", async () => {
		const question = makeQuestion();

		const answer = makeAnswer({ questionId: question.id });

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			authorId: question.authorId.toString(),
			answerId: answer.id.toString()
		});
	
		expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id);
	});

	it("should not be able to choose another user question best answer", async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityID("author-1")
		});

		const answer = makeAnswer({ questionId: question.id });

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		const response = await sut.execute({
			answerId: answer.id.toString(),
			authorId: "author-2"
		});

		expect(response.isLeft()).toBeTruthy();
		expect(response.value).toBeInstanceOf(NotAllowedError);
	});
});