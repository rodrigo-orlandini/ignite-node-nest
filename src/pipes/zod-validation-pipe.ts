import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          error: fromZodError(error),
          message: "Request params or body validation failed",
          statusCode: 400,
        });
      }

      throw new BadRequestException("Request params or body validation failed");
    }
    return value;
  }
}
