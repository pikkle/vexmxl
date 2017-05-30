import {VextabItem} from "./VextabItem";
export abstract class VexmxlTime implements VextabItem {
	constructor(private duration: string) {}

	public toString(): string {
		return ":" + this.duration + " " + this.representation();
	}

	protected abstract representation(): string;

}
