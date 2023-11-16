import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { Public } from "src/infra/auth/public";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { AuthenticateStudentUseCase } from "src/domain/forum/application/use-cases/authenticate-student";

import { WrongCredentialsError } from "src/domain/forum/application/use-cases/errors/wrong-credentials-error";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const response = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (response.isLeft()) {
      const error = response.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = response.value;

    return {
      access_token: accessToken,
    };
  }
}
