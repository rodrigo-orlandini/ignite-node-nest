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

import { HttpCommentPresenter } from "../presenters/http-comment-presenter";
import { FetchAnswerCommentsUseCase } from "src/domain/forum/application/use-cases/fetch-answer-comments";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  @HttpCode(206)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("answerId") answerId: string,
  ) {
    const response = await this.fetchAnswerComments.execute({
      page,
      answerId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const answerComments = response.value.answerComments;

    return {
      answerComments: answerComments.map(HttpCommentPresenter.toHTTP),
    };
  }
}
