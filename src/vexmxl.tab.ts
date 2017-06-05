export namespace VexMxlTab {
	export interface VextabItem {
		toString(): string;
	}

	const MEASURE_LENGTH: number = 400;
	export class VexmxlTablature implements VextabItem {
		private measures: VexmxlMeasure[] = [];

		constructor(private displaySheet: boolean = true, private scale: number = 1.0) {
		}

		public addMeasure(measure: VexmxlMeasure): void {
			this.measures.push(measure);
		}

		public getMeasures(): VexmxlMeasure[] {
			return this.measures;
		}

		public displayMusicSheet(b: boolean) {
			this.displaySheet = b;
		}

		public displayScale(ratio: number) {
			this.scale = ratio;
		}

		public width(): number {
			return MEASURE_LENGTH * this.measures.length;
		}

		public toString(): string {
			let options = "options width=" + this.width() + " scale=" + this.scale;
			return options + "\ntabstave notation= " + this.displaySheet + "\n" + this.measures.join("|\n");
		}

	}

	export class VexmxlMeasure implements VextabItem {
		private times: VexmxlTime[] = [];

		public addTime(time: VexmxlTime): void {
			this.times.push(time);
		}

		public getTimes(): VexmxlTime[] {
			return this.times;
		}

		public toString(): string {
			return "  notes " + this.times.join(" ");
		}

		public notEmpty(): boolean {
			return this.times.length > 0;
		}
	}

	export class VexmxlDuration implements VextabItem {
		public static WHOLE: VexmxlDuration = new VexmxlDuration("w");
		public static HALF: VexmxlDuration = new VexmxlDuration("h");
		public static HALF_DOT: VexmxlDuration = new VexmxlDuration("hd");
		public static QUARTER: VexmxlDuration = new VexmxlDuration("q");
		public static QUARTER_DOT: VexmxlDuration = new VexmxlDuration("qd");
		public static EIGHTH: VexmxlDuration = new VexmxlDuration("8");
		public static EIGHTH_DOT: VexmxlDuration = new VexmxlDuration("8d");
		public static SIXTEENTH: VexmxlDuration = new VexmxlDuration("16");
		public static SIXTEENTH_DOT: VexmxlDuration = new VexmxlDuration("16d");
		public static THIRTYSECOND: VexmxlDuration = new VexmxlDuration("32");

		private constructor(private representation: string) {
		}

		public toString(): string {
			return this.representation;
		}
	}

	export abstract class VexmxlTime implements VextabItem {
		constructor(private duration: VexmxlDuration) {
		}

		public toString(): string {
			return ":" + this.duration + " " + this.representation();
		}

		public getDuration(): VexmxlDuration {
			return this.duration;
		}

		public setDuration(duration: VexmxlDuration) {
			this.duration = duration;
		}

		protected abstract representation(): string;
	}

	export class VexmxlChord extends VexmxlTime {
		private notes: VexmxlNote[] = [];

		public addNote(note: VexmxlNote): void {
			this.notes.push(note);
		}

		public getNotes(): VexmxlNote[] {
			return this.notes;
		}

		public notEmpty(): boolean {
			return this.notes.length > 0;
		}

		protected representation(): string {
			return "(" + this.notes.join(".") + ")";
		}

	}

	export class VexmxlRest extends VexmxlTime {

		protected representation(): string {
			return "##";
		}

	}

	export class VexmxlNote implements VextabItem {

		constructor(private fret: number, private str: number) {
		}

		public toString(): string {
			return this.fret + "/" + this.str;
		}

		public getFret(): number {
			return this.fret;
		}

		public getString(): number {
			return this.str;
		}
	}

}
