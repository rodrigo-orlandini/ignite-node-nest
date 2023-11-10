import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { z } from "zod";

import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

import { PrismaService } from "src/prisma/prisma.service";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 1;

    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return { questions };
  }
}
