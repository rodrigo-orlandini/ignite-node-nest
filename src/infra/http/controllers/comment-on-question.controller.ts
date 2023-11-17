import {
  BadRequestException,
  Body,
  Param,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { CommentOnQuestionUseCase } from "src/domain/forum/application/use-cases/comment-on-question";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param("questionId") questionId: string,
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const authorId = user.sub;

    const response = await this.commentOnQuestion.execute({
      content,
      authorId,
      questionId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
