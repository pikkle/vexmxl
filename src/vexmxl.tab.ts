export namespace VexMxlTab {
	export interface VextabItem {
		toString(): string;
	}

	const MEASURE_LENGTH: number = 400;
	export class VexmxlTablature implements VextabItem {
		private measures: VexmxlMeasure[] = [];

		constructor(private title: string, private displayTablature: boolean = true, private displayStave: boolean = true, private scale: number = 1.0) {
		}

		public addMeasure(measure: VexmxlMeasure): void {
			this.measures.push(measure);
		}

		public getMeasures(): VexmxlMeasure[] {
			return this.measures;
		}

		public displayScale(ratio: number) {
			this.scale = ratio;
		}

		public width(): number {
			return MEASURE_LENGTH * this.measures.length;
		}

		public toString(): string {
			return `options width=${this.width()} scale=${this.scale}\n` +
				`tabstave notation=${this.displayStave} tablature=${this.displayTablature}\n` +
				this.measures.join("|\n");
		}

	}

	export class VexmxlTimeSignature implements VextabItem {
		constructor(private beats: number, private beatType: number){

		}
		public toString(): string {
			return `time=${this.beats}/${this.beatType}`;
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

	export enum VexmxlDuration {
		WHOLE = "w",
		HALF = "h",
		HALF_DOT = "hd",
		QUARTER = "q",
		QUARTER_DOT = "qd",
		EIGHTH = "8",
		EIGHTH_DOT = "8d",
		SIXTEENTH = "16",
		SIXTEENTH_DOT = "16d",
		THIRTYSECOND = "32"
	}

	export abstract class VexmxlTime implements VextabItem {
		constructor(private duration: VexmxlDuration) {
		}

		public toString(): string {
			return `: ${this.duration} ${this.representation()}`;
		}

		public getDuration(): VexmxlDuration {
			return this.duration;
		}

		public setDuration(duration: VexmxlDuration) {
			this.duration = duration;
		}

		public adaptPitch(modifier: number): void {};

		protected abstract representation(): string;
	}

	export class VexmxlChord extends VexmxlTime {
		private notes: VexmxlNote[] = [];

		private sortNotes(): void {
			this.notes.sort((a, b) => {
				return b.getString() - a.getString()
			});
		}

		public addNote(note: VexmxlNote): void {
			if (this.hasNote(note.getString())) {
				throw new Error("A chord can only have one note on the same string")
			} else this.notes.push(note);
		}

		private hasNote(string: number): boolean {
			for (let note of this.notes) {
				if (note.getString() === string) return true;
			}
			return false;
		}

		public getNotes(): VexmxlNote[] {
			return this.notes;
		}

		public notEmpty(): boolean {
			return this.notes.length > 0;
		}

		protected representation(): string {
			this.sortNotes();
			return `(${this.notes.join(".")})`;
		}

		public adaptPitch(modifier: number): void {
			for (let note of this.notes) {
				note.adaptPitch(modifier);
			}
		}

	}

	export class VexmxlRest extends VexmxlTime {

		protected representation(): string {
			return "##";
		}

	}

	export class VexmxlNote implements VextabItem {
		private modifier: number;

		constructor(private fret: number, private str: number) {
			if (str <= 0 || str > 6) {
				throw new Error("A string is in the bounds [1, 6]");
			} else if (fret < 0 || fret > 24) {
				throw new Error("A fret is in the bounds [0, 24]");
			}

			this.modifier = 0;
		}

		public toString(): string {
			return `${(this.fret+this.modifier)}/${this.str}`;
		}

		public getFret(): number {
			return this.fret;
		}

		public getString(): number {
			return this.str;
		}

		public adaptPitch(modifier: number): void {
			this.modifier = modifier;
		}
	}

}
