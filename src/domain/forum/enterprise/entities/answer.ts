import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { AnswerAttachmentList } from "./answer-attachment-list";
import { AnswerCreatedEvent } from "../events/answer-created-event";

export interface AnswerProps {
	content: string;
	authorId: UniqueEntityID;
	questionId: UniqueEntityID;
	attachments: AnswerAttachmentList;
	createdAt: Date;
	updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get attachments() {
		return this.props.attachments;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt(): string {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set attachments(attachments: AnswerAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	public static create(props: Optional<AnswerProps, "createdAt" | "attachments">, id?: UniqueEntityID) {
		const answer = new Answer({
			...props,
			attachments: props.attachments ?? new AnswerAttachmentList(),
			createdAt: new Date()
		}, id);

		const isNewAnswer = !id;
		if(isNewAnswer) {
			const answerCreatedEvent = new AnswerCreatedEvent(answer);
			answer.addDomainEvent(answerCreatedEvent);
		}

		return answer;
	}
}