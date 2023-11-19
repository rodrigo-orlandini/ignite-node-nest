import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

import { UniqueEntityID } from "src/core/entities/unique-entity-id";

import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { makeStudent } from "test/factories/make-student";

let sut: FetchQuestionCommentsUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;

describe("Fetch Question Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent({ name: "John Doe" });
    await inMemoryStudentsRepository.create(student);

    await Promise.all([
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      ),
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      ),
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      ),
    ]);

    const response = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(response.value?.questionComments).toHaveLength(3);
    expect(response.value?.questionComments[0]).toHaveProperty("authorName");
  });

  it("should be able to paginate question comments", async () => {
    const student = makeStudent({ name: "John Doe" });
    await inMemoryStudentsRepository.create(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      );
    }

    const response = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(response.value?.questionComments).toHaveLength(2);
  });
});
