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

import { FetchQuestionCommentsUseCase } from "src/domain/forum/application/use-cases/fetch-question-comments";
import { HttpCommentPresenter } from "../presenters/http-comment-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  @HttpCode(206)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("questionId") questionId: string,
  ) {
    const response = await this.fetchQuestionComments.execute({
      page,
      questionId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const questionComments = response.value.questionComments;

    return {
      questionComments: questionComments.map(HttpCommentPresenter.toHTTP),
    };
  }
}
