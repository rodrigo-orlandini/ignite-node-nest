import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";

import { FetchQuestionAnswersUseCase } from "src/domain/forum/application/use-cases/fetch-question-answers";
import { HttpAnswerPresenter } from "../presenters/http-answer-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  @HttpCode(206)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("questionId") questionId: string,
  ) {
    const response = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const answers = response.value.answers;

    return { answers: answers.map(HttpAnswerPresenter.toHTTP) };
  }
}
