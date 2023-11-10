import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";

// eslint-disable-next-line
type DomainEventCallback = (event: any) => void

export class DomainEvents {
	// eslint-disable-next-line
	private static markedAggregates: AggregateRoot<any>[] = [];
	private static handlersMap: Record<string, DomainEventCallback[]> = {};

	// eslint-disable-next-line
	public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
		const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			this.markedAggregates.push(aggregate);
		}
	}

	// eslint-disable-next-line
	private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
		aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event));
	}

	// eslint-disable-next-line
	private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>,) {
		const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

		this.markedAggregates.splice(index, 1);
	}

	// eslint-disable-next-line
	private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | undefined {
		return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
	}

	public static dispatchEventsForAggregate(id: UniqueEntityID) {
		const aggregate = this.findMarkedAggregateByID(id);

		if (aggregate) {
			this.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			this.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(callback: DomainEventCallback, eventClassName: string) {
		const wasEventRegisteredBefore = eventClassName in this.handlersMap;

		if (!wasEventRegisteredBefore) {
			this.handlersMap[eventClassName] = [];
		}

		this.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers() {
		this.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		this.markedAggregates = [];
	}

	private static dispatch(event: DomainEvent) {
		const eventClassName: string = event.constructor.name;

		const isEventRegistered = eventClassName in this.handlersMap;

		if (isEventRegistered) {
			const handlers = this.handlersMap[eventClassName];

			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
