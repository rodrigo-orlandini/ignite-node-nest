import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";

import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

import { makeQuestion } from "test/factories/make-question";

let sut: FetchRecentQuestionsUseCase;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;

describe("Fetch Recent Questions Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);

		sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to fetch recent questions", async () => {
		await Promise.all([
			inMemoryQuestionsRepository.create(
				makeQuestion({ 
					createdAt: new Date(2023, 6, 25) 
				})
			),
			inMemoryQuestionsRepository.create(
				makeQuestion({ 
					createdAt: new Date(2023, 6, 22) 
				})
			),
			inMemoryQuestionsRepository.create(
				makeQuestion({ 
					createdAt: new Date(2023, 6, 27) 
				})
			)
		]);

		const response = await sut.execute({ page: 1 });

		expect(response.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 6, 27) }),
			expect.objectContaining({ createdAt: new Date(2023, 6, 25) }),
			expect.objectContaining({ createdAt: new Date(2023, 6, 22) }),
		]);
	});

	it("should be able to paginate recent questions", async () => {
		for(let i = 1; i <= 22; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion());
		}

		const response = await sut.execute({ page: 2 });

		expect(response.value?.questions).toHaveLength(2);
	});
});