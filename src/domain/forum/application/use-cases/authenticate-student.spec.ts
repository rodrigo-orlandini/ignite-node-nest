import { AuthenticateStudentUseCase } from "./authenticate-student";

import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { StubHasher } from "test/cryptography/stub-hasher";
import { StubEncrypter } from "test/cryptography/stub-encrypter";

import { makeStudent } from "test/factories/make-student";

let sut: AuthenticateStudentUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let stubHasher: StubHasher;
let stubEncrypter: StubEncrypter;

describe("Authenticate Student Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    stubHasher = new StubHasher();
    stubEncrypter = new StubEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      stubHasher,
      stubEncrypter,
    );
  });

  it("should be able to authenticate student", async () => {
    const password = "some-password";
    const student = makeStudent({
      password: await stubHasher.hash(password),
    });

    await inMemoryStudentsRepository.create(student);

    const response = await sut.execute({
      email: student.email,
      password,
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
