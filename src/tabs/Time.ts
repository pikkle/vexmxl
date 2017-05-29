import {VextabItem} from "./VextabItem";
export abstract class Time implements VextabItem {
	constructor(private duration: string) {}

	toString(): string {
		return ":" + this.duration + " " + this.representation();
	}

	abstract representation(): string;
}