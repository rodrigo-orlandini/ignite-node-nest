import { DomainEvent } from "./domain-event";
import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.aggregate = aggregate;
		this.ocurredAt = new Date();
	}

	public getAggregateId(): UniqueEntityID {
		return this.aggregate.id;
	}
}

class CustomAggregate extends AggregateRoot<null> {
	public static create() {
		const aggregate = new CustomAggregate(null);

		const event = new CustomAggregateCreated(aggregate);
		aggregate.addDomainEvent(event);

		return aggregate;
	}
}

describe("Domain Events", () => {
	it("should be able to dispatch and listen to events", () => {
		// Add a new subscriber
		const callbackSpy = vi.fn();
		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		// Dispatching event for subscriber
		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalledOnce();
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});