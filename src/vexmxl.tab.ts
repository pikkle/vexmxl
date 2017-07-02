
export namespace VexMxlTab {
	export interface VextabItem {
		toString(): string;
	}

	const MEASURE_LENGTH: number = 400;
	export class VexmxlTablature implements VextabItem {
		private measures: VexmxlMeasure[] = [];

		constructor(private title: string,
		            private time: VexmxlTimeSignature,
		            private bpm: number,
		            private displayTablature: boolean = true,
		            private displayStave: boolean = true,
		            private scale: number = 1.0) {
		}

		public getTitle(): string {
			return this.title;
		}

		public getBPM(): number {
			return this.bpm;
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

		public getMeasureLengths(): number[] {
			return this.measures.map(m => m.sumOfTimes());
		}

		public toString(): string {
			this.measures.map(m => {
				if (m.sumOfTimes() != this.time.getBeatType())
					console.warn("Measure does not fulfill the time signature !");
			});
			return `options width=${this.width()} scale=${this.scale}\n` +
				`tabstave notation=${this.displayStave} tablature=${this.displayTablature}\n time=${this.time}\n` +
				this.measures.join("|\n");
		}

	}

	export class VexmxlTimeSignature implements VextabItem {
		constructor(private beats: number, private beatType: number){
		}

		public getBeats(): number {
			return this.beats;
		}

		public getBeatType(): number {
			return this.beatType;
		}

		public toString(): string {
			return `${this.beats}/${this.beatType}`;
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

		public sumOfTimes(): number {
			return this.times
				.map(t => t.getDuration().value())
				.reduce((sum, current) => sum + current);
		}

		public toString(): string {
			return "  notes " + this.times.join(" ");
		}

		public notEmpty(): boolean {
			return this.times.length > 0;
		}
	}

	export class VexmxlDuration {
		public static WHOLE = new VexmxlDuration("whole", "w", 4);
		public static HALF_DOT = new VexmxlDuration(undefined, "hd", 2 + 1);
		public static HALF = new VexmxlDuration("half", "h", 2);
		public static QUARTER_DOT = new VexmxlDuration(undefined, "qd", 1 + 1/2);
		public static QUARTER = new VexmxlDuration("quarter", "q", 1);
		public static EIGHTH_DOT = new VexmxlDuration(undefined, "8d", 1/2 + 1/4);
		public static EIGHTH = new VexmxlDuration("eighth", "8", 1/2);
		public static T16_DOT = new VexmxlDuration(undefined, "16d", 1/4 + 1/8);
		public static T16 = new VexmxlDuration("16th", "16", 1/4);
		public static T32_DOT= new VexmxlDuration(undefined, "32d", 1/8 + 1/16);
		public static T32 = new VexmxlDuration("32nd", "32", 1/8);
		public static T64_DOT = new VexmxlDuration(undefined, "64d", 1/16 + 1/32);
		public static T64 = new VexmxlDuration("64th", "64", 1/16);
		public static T128_DOT = new VexmxlDuration(undefined, "128d", 1/32 + 1/64);
		public static T128 = new VexmxlDuration("128th", "128", 1/32);

		private constructor(private musicxml: string, private vextab: string, private val: number) {}

		public static fromMusicxml(musicxml: string): VexmxlDuration {
			return undefined;
		}

		public value(): number {
			return this.val;
		}

		public toString(): string {
			return this.vextab.toString();
		}

	}

	export abstract class VexmxlTime implements VexMxlTab.VextabItem {
		constructor(private duration: VexMxlTab.VexmxlDuration) {
		}

		public toString(): string {
			return `:${this.duration}${this.representation()}`;
		}

		public getDuration(): VexMxlTab.VexmxlDuration {
			return this.duration;
		}

		public setDuration(duration: VexMxlTab.VexmxlDuration) {
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
				note.pitch(modifier);
			}
		}


	}

	export class VexmxlRest extends VexmxlTime {

		protected representation(): string {
			return "##";
		}

	}

	export class VexmxlNote implements VextabItem {
		private _pitch: number;
		private _bend: number;

		constructor(private fret: number, private str: number) {
			if (str <= 0 || str > 6) {
				throw new Error("A string is in the bounds [1, 6]");
			} else if (fret < 0 || fret > 24) {
				throw new Error("A fret is in the bounds [0, 24]");
			}

			this._pitch = 0;
		}

		public toString(): string {
			let b = '';
			if (this._bend) {
				b = `b${this.fret+this._pitch+this._bend}`;
			}
			return `${(this.fret+this._pitch)}${b}/${this.str}`;
		}

		public getFret(): number {
			return this.fret;
		}

		public getString(): number {
			return this.str;
		}

		public pitch(modifier: number): void {
			this._pitch = modifier;
		}

		public bend(amount: number): void {
			this._bend = amount;
		}

	}

}
