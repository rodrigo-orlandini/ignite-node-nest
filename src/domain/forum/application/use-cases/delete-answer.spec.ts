import { DeleteAnswerUseCase } from "./delete-answer";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let sut: DeleteAnswerUseCase;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;

describe("Delete Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);

		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to delete an answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID("author-1")
		}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(newAnswer);

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityID("1") }),
			makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityID("2") })
		);

		await sut.execute({
			authorId: "author-1",
			questionId: "answer-1"
		});
	
		expect(inMemoryAnswersRepository.items).toHaveLength(0);
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an answer from another user", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID("author-1")
		}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(newAnswer);

		const response = await sut.execute({
			authorId: "author-2",
			questionId: "answer-1"
		});

		expect(response.isLeft()).toBeTruthy();
		expect(response.value).toBeInstanceOf(NotAllowedError);
	});
});