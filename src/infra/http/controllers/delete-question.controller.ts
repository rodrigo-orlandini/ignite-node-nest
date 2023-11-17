import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Delete,
} from "@nestjs/common";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { DeleteQuestionUseCase } from "src/domain/forum/application/use-cases/delete-question";

@Controller("/questions/:id")
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const response = await this.deleteQuestion.execute({
      authorId: userId,
      questionId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
