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
import { CommentOnAnswerUseCase } from "src/domain/forum/application/use-cases/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param("answerId") answerId: string,
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const authorId = user.sub;

    const response = await this.commentOnAnswer.execute({
      content,
      authorId,
      answerId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
