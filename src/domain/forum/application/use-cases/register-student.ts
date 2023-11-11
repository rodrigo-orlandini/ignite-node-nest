import { Injectable } from "@nestjs/common";

import { Either, left, right } from "src/core/either";

import { Student } from "../../enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { HashGenerator } from "../cryptography/hash-generator";

import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const doesStudentEmailAlreadyExist =
      await this.studentsRepository.findByEmail(email);

    if (doesStudentEmailAlreadyExist) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashPassword,
    });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
