import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let sut: AnswerQuestionUseCase;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;

describe("Answer Question Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);

		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it("should be able to answer a question", async () => {
		const response = await sut.execute({
			instructorId: "1",
			questionId: "1",
			content: "New test answer",
			attachmentsIds: ["1", "2"]
		});
	
		expect(response.isRight()).toBeTruthy();
		expect(inMemoryAnswersRepository.items[0]).toEqual(response.value?.answer);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("2") })
		]);
	});
});