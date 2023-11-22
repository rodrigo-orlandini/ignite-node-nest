import { Question } from "../../enterprise/entities/question";

import { PaginationParams } from "src/core/repositories/pagination-params";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
  abstract findById(id: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;

  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
}
