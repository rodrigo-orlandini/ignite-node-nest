import { EditAnswerUseCase } from "./edit-answer";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

import { NotAllowedError } from "../../../../core/errors/not-allowed-error";

let sut: EditAnswerUseCase;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;

describe("Edit Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);

		sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
	});

	it("should be able to edit an answer", async () => {
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
			answerId: "answer-1",
			content: "Test Content",
			attachmentsIds: ["1", "3"]
		});
	
		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: "Test Content"
		});
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("3") })
		]);
	});

	it("should not be able to edit an answer from another user", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID("author-1")
		}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(newAnswer);

		const response = await sut.execute({
			authorId: "author-2",
			answerId: "answer-1",
			content: "Test Content",
			attachmentsIds: []
		});

		expect(response.isLeft()).toBeTruthy();
		expect(response.value).toBeInstanceOf(NotAllowedError);
	});
});