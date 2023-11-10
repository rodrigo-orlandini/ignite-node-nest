import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

import { makeQuestion } from "test/factories/make-question";

let sut: GetQuestionBySlugUseCase;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;

describe("Get Question By Slug Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);

		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to get a question by slug", async () => {
		const newQuestion = makeQuestion();

		await inMemoryQuestionsRepository.create(newQuestion);

		const response = await sut.execute({
			slug: "example-question"
		});
	
		expect(response.isRight()).toBeTruthy();
	});
});