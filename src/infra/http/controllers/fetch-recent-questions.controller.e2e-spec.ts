import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import request from "supertest";

import { AppModule } from "src/infra/app.module";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

describe("Fetch recent questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "12345678",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.create({
      data: {
        title: "Question 01",
        slug: "question-01",
        content: "Question content",
        authorId: user.id,
      },
    });

    await prisma.question.create({
      data: {
        title: "Question 02",
        slug: "question-02",
        content: "Question content",
        authorId: user.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(206);
    expect(response.body.questions).toHaveLength(2);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: "Question 02" }),
        expect.objectContaining({ title: "Question 01" }),
      ],
    });
  });
});
