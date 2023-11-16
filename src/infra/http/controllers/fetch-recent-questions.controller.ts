import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";

import { FetchRecentQuestionsUseCase } from "src/domain/forum/application/use-cases/fetch-recent-questions";
import { HttpQuestionPresenter } from "../presenters/http-question-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  @HttpCode(206)
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const response = await this.fetchRecentQuestions.execute({ page });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const questions = response.value.questions;

    return { questions: questions.map(HttpQuestionPresenter.toHTTP) };
  }
}
