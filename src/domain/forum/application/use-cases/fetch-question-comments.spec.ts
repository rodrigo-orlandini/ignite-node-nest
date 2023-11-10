import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";

let sut: FetchQuestionCommentsUseCase;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;

describe("Fetch Question Comments Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();

		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to fetch question comments", async () => {
		await Promise.all([
			inMemoryQuestionCommentsRepository.create(makeQuestionComment({
				questionId: new UniqueEntityID("question-1")
			})),
			inMemoryQuestionCommentsRepository.create(makeQuestionComment({
				questionId: new UniqueEntityID("question-1")
			})),
			inMemoryQuestionCommentsRepository.create(makeQuestionComment({
				questionId: new UniqueEntityID("question-1")
			}))
		]);

		const response = await sut.execute({ 
			questionId: "question-1",
			page: 1 
		});

		expect(response.value?.questionComments).toHaveLength(3);
	});

	it("should be able to paginate question comments", async () => {
		for(let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
				questionId: new UniqueEntityID("question-1")
			}));
		}

		const response = await sut.execute({ 
			questionId: "question-1",
			page: 2 
		});

		expect(response.value?.questionComments).toHaveLength(2);
	});
});