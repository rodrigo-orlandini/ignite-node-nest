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
import { AnswerQuestionUseCase } from "src/domain/forum/application/use-cases/answer-question";

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param("questionId") questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const instructorId = user.sub;

    const response = await this.answerQuestion.execute({
      content,
      instructorId,
      questionId,
      attachmentsIds: [],
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
