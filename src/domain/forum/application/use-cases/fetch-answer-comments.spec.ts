import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

import { UniqueEntityID } from "src/core/entities/unique-entity-id";

import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { makeStudent } from "test/factories/make-student";

let sut: FetchAnswerCommentsUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;

describe("Fetch Answer Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });
    await inMemoryStudentsRepository.create(student);

    await Promise.all([
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      ),
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      ),
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      ),
    ]);

    const response = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(response.value?.answerComments).toHaveLength(3);
    expect(response.value?.answerComments[0]).toHaveProperty("authorName");
  });

  it("should be able to paginate answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });
    await inMemoryStudentsRepository.create(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      );
    }

    const response = await sut.execute({
      answerId: "answer-1",
      page: 2,
    });

    expect(response.value?.answerComments).toHaveLength(2);
  });
});
