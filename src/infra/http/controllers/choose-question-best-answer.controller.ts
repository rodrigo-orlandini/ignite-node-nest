import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ChooseQuestionBestAnswerUseCase } from "src/domain/forum/application/use-cases/choose-question-best-answer";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("answerId") answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const response = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
