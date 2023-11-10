import { SendNotificationUseCase } from "./send-notification";

import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";

let sut: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

describe("Send Notification Use Case", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to send a notification", async () => {
		const response = await sut.execute({
			recipientId: "1",
			title: "1",
			content: "New test notification"
		});
	
		expect(response.isRight()).toBeTruthy();
		expect(inMemoryNotificationsRepository.items[0]).toEqual(response.value?.notification);
	});
});