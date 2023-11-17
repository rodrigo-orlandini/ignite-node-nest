import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Delete,
} from "@nestjs/common";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { DeleteAnswerUseCase } from "src/domain/forum/application/use-cases/delete-answer";

@Controller("/answers/:id")
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const response = await this.deleteAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
