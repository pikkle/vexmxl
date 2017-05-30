import {VextabItem} from "./VextabItem";

export class VexmxlNote implements VextabItem {

	constructor(private fret: number, private str: number) {}

	public toString(): string {
		return this.fret + "/" + this.str;
	}

}
