import { RegisterStudentUseCase } from "./register-student";

import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { StubHasher } from "test/cryptography/stub-hasher";

let sut: RegisterStudentUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let stubHasher: StubHasher;

describe("Register Student Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    stubHasher = new StubHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, stubHasher);
  });

  it("should be able to register student", async () => {
    const response = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "some-password",
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it("should be able to hash student password upon registration", async () => {
    const password = "some-password";

    const response = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password,
    });

    const hashedPassword = await stubHasher.hash(password);

    expect(response.isRight()).toBeTruthy();
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
