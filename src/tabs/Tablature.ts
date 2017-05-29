import {VextabItem} from "./VextabItem";
import {Measure} from "./Measure";

const MEASURE_LENGTH: number = 400;
export class Tablature implements VextabItem {
	private measures: Measure[] = [];

	constructor(private displaySheet: boolean = true, private scale: number = 1.0) {}

	public addMeasure(measure: Measure): void {
		this.measures.push(measure);
	}

	public toString(): string {
		let width = MEASURE_LENGTH * this.measures.length;
		let options = "options width=" + width + " scale=" + this.scale;

		return options + "\ntabstave notation= " + this.displaySheet + "\n" + this.measures.join("|\n");
	}

}