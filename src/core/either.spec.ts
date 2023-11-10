import { Either, left, right } from "./either";

const doSomething = (shouldSuccess: boolean): Either<string, string> => {
	if(shouldSuccess) {
		return right("Success");
	}

	return left("Failure");
};

test("it should be able to return a success result", () => {
	const success = doSomething(true);

	expect(success.isRight()).toBeTruthy();
	expect(success.isLeft()).toBeFalsy();
});

test("it should be able to return a failure", () => {
	const failure = doSomething(false);

	expect(failure.isRight()).toBeFalsy();
	expect(failure.isLeft()).toBeTruthy();
});