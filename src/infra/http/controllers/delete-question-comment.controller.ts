import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Delete,
} from "@nestjs/common";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { DeleteQuestionCommentUseCase } from "src/domain/forum/application/use-cases/delete-question-comment";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") questionCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const response = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
