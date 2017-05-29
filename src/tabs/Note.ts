import {VextabItem} from "./VextabItem";

export class Note implements VextabItem {

	constructor(private fret: number, private string: number) {}

	toString(): string {
		return this.fret + "/" + this.string;
	}

}