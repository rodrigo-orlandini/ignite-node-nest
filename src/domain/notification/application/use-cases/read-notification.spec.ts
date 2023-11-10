import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

import { ReadNotificationUseCase } from "./read-notification";

import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeNotification } from "test/factories/make-notification";

let sut: ReadNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

describe("Read Notification Use Case", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to read a notification", async () => {
		const notification = makeNotification();
		await inMemoryNotificationsRepository.create(notification);
		
		const response = await sut.execute({
			recipientId: notification.recipientId.toString(),
			notificationId: notification.id.toString()
		});
	
		expect(response.isRight()).toBeTruthy();
		expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date));
	});

	it("should not be able to delete a notification from another user", async () => {
		const newNotification = makeNotification({
			recipientId: new UniqueEntityID("recipient-1")
		});

		await inMemoryNotificationsRepository.create(newNotification);

		const response = await sut.execute({
			notificationId: newNotification.id.toString(),
			recipientId: "recipient-2"
		});

		expect(response.isLeft()).toBeTruthy();
		expect(response.value).toBeInstanceOf(NotAllowedError);
	});
});