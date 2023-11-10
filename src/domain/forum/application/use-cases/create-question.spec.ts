import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CreateQuestionUseCase } from "./create-question";

import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let sut: CreateQuestionUseCase;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;

describe("Create Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);

		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to create a question", async () => {
		const response = await sut.execute({
			authorId: "1",
			title: "1",
			content: "New test answer",
			attachmentsIds: ["1", "2"]
		});
	
		expect(response.isRight()).toBeTruthy();
		expect(inMemoryQuestionsRepository.items[0]).toEqual(response.value?.question);
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("2") })
		]);
	});
});