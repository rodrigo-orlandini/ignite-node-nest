import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";

import request from "supertest";

import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { DomainEvents } from "src/core/events/domain-events";
import { waitFor } from "test/utils/wait-for";

import { AppModule } from "src/infra/app.module";
import { DatabaseModule } from "src/infra/database/database.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";

describe("On Answer Created (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should send a notification when answer is created", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New answer",
        attachments: [],
      });

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: { recipientId: user.id.toString() },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
