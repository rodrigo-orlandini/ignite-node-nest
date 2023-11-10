export class Slug {
	public value: string;

	private constructor(value: string) {
		this.value = value;
	}

	public static create(text: string) {
		return new Slug(text);
	}

	/**
	 * Receives a string and normalize it as a slug.
	 * 
	 * Example: "An example title" => "an-example-title"
	 * 
	 * @param text {string}
	 */
	public static createFromText(text: string) {
		const slugText = text
			.normalize("NFKD")
			.toLocaleLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_/g, "-")
			.replace(/--+/g, "-")
			.replace(/-$/g, "");

		return new Slug(slugText);
	}
}