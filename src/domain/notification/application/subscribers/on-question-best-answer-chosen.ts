import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";

import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor (
		private answersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase
	) {
		this.setupSubscriptions();
	}

	public setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerChosenNotification.bind(this), 
			QuestionBestAnswerChosenEvent.name
		);
	}

	private async sendQuestionBestAnswerChosenNotification({ question, bestAnswerId }: QuestionBestAnswerChosenEvent) {
		const answer = await this.answersRepository.findById(bestAnswerId.toString());

		if(answer) {
			await this.sendNotification.execute({
				recipientId: answer.authorId.toString(),
				title: "Your response was chosen as the best!",
				content: `The answer you sent in ${question.title.substring(0, 20).concat("...")} was chosen by the author as the best one!`
			});
		}
	}
}