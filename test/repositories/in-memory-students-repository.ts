import { StudentsRepository } from "src/domain/forum/application/repositories/students-repository";
import { Student } from "src/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  async create(student: Student): Promise<void> {
    this.items.push(student);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((student) => student.email === email);

    if (!student) {
      return null;
    }

    return student;
  }
}
