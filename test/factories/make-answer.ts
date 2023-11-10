import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  Answer,
  AnswerProps,
} from "src/domain/forum/enterprise/entities/answer";

export const makeAnswer = (
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) => {
  const question = Answer.create(
    {
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
};
