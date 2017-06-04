export namespace VexMxlTab {
	export interface VextabItem {
		toString(): string;
	}

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

	export class VexmxlMeasure implements VextabItem {
		private times: VexmxlTime[] = [];

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

	export abstract class VexmxlTime implements VextabItem {
		constructor(private duration: string) {}

		public toString(): string {
			return ":" + this.duration + " " + this.representation();
		}

		public setDuration(duration: string) {
			this.duration = duration;
		}

		protected abstract representation(): string;
	}

	export class VexmxlChord extends VexmxlTime {
		private notes: VexmxlNote[] = [];

		public addNote(note: VexmxlNote): void {
			this.notes.push(note);
		}

		public notEmpty(): boolean {
			return this.notes.length > 0;
		}

		protected representation(): string {
			return "(" + this.notes.join (".") + ")";
		}

	}

	export class VexmxlRest extends VexmxlTime {

		protected representation(): string {
			return "##";
		}

	}

	export class VexmxlNote implements VextabItem {

		constructor(private fret: number, private str: number) {}

		public toString(): string {
			return this.fret + "/" + this.str;
		}

	}

}
