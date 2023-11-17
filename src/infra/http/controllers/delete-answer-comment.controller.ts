import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Delete,
} from "@nestjs/common";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { DeleteAnswerCommentUseCase } from "src/domain/forum/application/use-cases/delete-answer-comment";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") answerCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const response = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
