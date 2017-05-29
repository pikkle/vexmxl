import {VextabItem} from "./VextabItem";
import {Time} from "./Time";

export class Measure implements VextabItem {
	private times: Time[] = [];

	constructor() {}

	public addTime(time: Time): void {
		this.times.push(time);
	}

	public toString(): string {
		return "  notes " + this.times.join(" ");
	}

	public notEmpty(): boolean {
		return this.times.length > 0;
	}
}