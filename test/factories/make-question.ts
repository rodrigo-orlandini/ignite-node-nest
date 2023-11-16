import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  Question,
  QuestionProps,
} from "src/domain/forum/enterprise/entities/question";

import { PrismaQuestionMapper } from "src/infra/database/prisma/mappers/prisma-question-mapper";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";

export const makeQuestion = (
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) => {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      slug: Slug.create("example-question"),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
};

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
