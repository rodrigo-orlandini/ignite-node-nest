import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { DomainEvent } from "src/core/events/domain-event";
import { Answer } from "../entities/answer";

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
