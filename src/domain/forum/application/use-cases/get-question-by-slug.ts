import { Either, left, right } from "src/core/either";

import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";
import { QuestionsRepository } from "../repositories/questions-repository";

import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  public async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
