import { DeleteQuestionCommentUseCase } from "./delete-question-comment";

import { UniqueEntityID } from "src/core/entities/unique-entity-id";

import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

import { NotAllowedError } from "../../../../core/errors/not-allowed-error";

let sut: DeleteQuestionCommentUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;

describe("Delete Question Comment Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID("author-1"),
    });
    await inMemoryQuestionCommentsRepository.create(questionComment);

    const response = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: "author-2",
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
