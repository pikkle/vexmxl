import {VextabItem} from "./VextabItem";
import {VexmxlTime} from "./VexmxlTime";

export class VexmxlMeasure implements VextabItem {
	private times: VexmxlTime[] = [];

	constructor() {}

	public addTime(time: VexmxlTime): void {
		this.times.push(time);
	}

	public toString(): string {
		return "  notes " + this.times.join(" ");
	}

	public notEmpty(): boolean {
		return this.times.length > 0;
	}
}
