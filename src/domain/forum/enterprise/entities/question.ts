import dayjs from "dayjs";

import { Slug } from "./value-objects/slug";

import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
	title: string;
	slug: Slug;
	content: string;
	authorId: UniqueEntityID;
	bestAnswerId?: UniqueEntityID;
	attachments: QuestionAttachmentList;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
	get title() {
		return this.props.title;
	}

	get slug() {
		return this.props.slug;
	}

	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
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

	get isNew(): boolean {
		return dayjs().diff(this.createdAt, "days") <= 3;
	}

	get excerpt(): string {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
		if(bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
			const questionBestAnswerChosenEvent = new QuestionBestAnswerChosenEvent(this, bestAnswerId);
			this.addDomainEvent(questionBestAnswerChosenEvent);
		}

		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	public static create(props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">, id?: UniqueEntityID) {
		const question = new Question({
			...props,
			slug: props.slug ?? Slug.createFromText(props.title),
			attachments: props.attachments ?? new QuestionAttachmentList(),
			createdAt: props.createdAt ?? new Date(),
		}, id);

		return question;
	}
}
