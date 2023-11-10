import { CommentOnAnswerUseCase } from "./comment-on-answer";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

import { makeAnswer } from "test/factories/make-answer";

let sut: CommentOnAnswerUseCase;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;

describe("Comment On Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

		sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository);
	});

	it("should be able to comment on answer", async () => {
		const answer = makeAnswer();
		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content: "Test comment"
		});
	
		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual("Test comment");
	});
});