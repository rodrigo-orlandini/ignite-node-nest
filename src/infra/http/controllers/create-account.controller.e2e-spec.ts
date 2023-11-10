import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import request from "supertest";

import { AppModule } from "src/infra/app.module";
import { PrismaService } from "src/infra/database/prisma/prisma.service";

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "12345678",
    });

    expect(response.statusCode).toBe(201);

    const isUserOnDatabase = await prisma.user.findUnique({
      where: { email: "johndoe@example.com" },
    });

    expect(isUserOnDatabase).toBeTruthy();
  });
});
