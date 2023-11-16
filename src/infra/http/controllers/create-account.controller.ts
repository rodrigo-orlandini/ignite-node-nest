import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

import { RegisterStudentUseCase } from "src/domain/forum/application/use-cases/register-student";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const response = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (response.isLeft()) {
      throw new Error();
    }
  }
}
