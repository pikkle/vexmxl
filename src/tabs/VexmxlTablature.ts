import {VextabItem} from "./VextabItem";
import {VexmxlMeasure} from "./VexmxlMeasure";

const MEASURE_LENGTH: number = 400;
export class VexmxlTablature implements VextabItem {
	private measures: VexmxlMeasure[] = [];

	constructor(private displaySheet: boolean = true, private scale: number = 1.0) {}

	public addMeasure(measure: VexmxlMeasure): void {
		this.measures.push(measure);
	}

	public toString(): string {
		let width = MEASURE_LENGTH * this.measures.length;
		let options = "options width=" + width + " scale=" + this.scale;

		return options + "\ntabstave notation= " + this.displaySheet + "\n" + this.measures.join("|\n");
	}

}
