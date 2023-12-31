import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from "@nestjs/common";

import { GetQuestionBySlugUseCase } from "src/domain/forum/application/use-cases/get-question-by-slug";
import { HttpQuestionDetailsPresenter } from "../presenters/http-question-details-presenter";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("slug") slug: string) {
    const response = await this.getQuestionBySlug.execute({ slug });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    const question = response.value.question;

    return { question: HttpQuestionDetailsPresenter.toHTTP(question) };
  }
}
