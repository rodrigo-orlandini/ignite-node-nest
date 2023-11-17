import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";

import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { EditAnswerUseCase } from "src/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const userId = user.sub;

    const response = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: [],
      answerId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
