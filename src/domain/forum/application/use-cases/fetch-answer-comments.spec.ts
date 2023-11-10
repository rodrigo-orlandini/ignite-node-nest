import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let sut: FetchAnswerCommentsUseCase;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;

describe("Fetch Answer Comments Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to fetch answer comments", async () => {
		await Promise.all([
			inMemoryAnswerCommentsRepository.create(makeAnswerComment({
				answerId: new UniqueEntityID("answer-1")
			})),
			inMemoryAnswerCommentsRepository.create(makeAnswerComment({
				answerId: new UniqueEntityID("answer-1")
			})),
			inMemoryAnswerCommentsRepository.create(makeAnswerComment({
				answerId: new UniqueEntityID("answer-1")
			}))
		]);

		const response = await sut.execute({ 
			answerId: "answer-1",
			page: 1 
		});

		expect(response.value?.answerComments).toHaveLength(3);
	});

	it("should be able to paginate answer comments", async () => {
		for(let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
				answerId: new UniqueEntityID("answer-1")
			}));
		}

		const response = await sut.execute({ 
			answerId: "answer-1",
			page: 2 
		});

		expect(response.value?.answerComments).toHaveLength(2);
	});
});