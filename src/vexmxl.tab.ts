/**
 * Vexmxl representable interface.
 * All vexmxl element must have a vextab representation
 */
export interface Item {
	/**
     * Gives the vextab representation of the item
	 * @returns {string} vextab representation
	 */
	toVextab(): string;
}

const MEASURE_LENGTH: number = 400;
let vextab = new Artist(0, 0, 1);

/**
 * Top class that represents the whole tablature.
 */
export class Tablature implements Item {
    private measures: Measure[] = [];

    constructor(private title: string,
                private time: TimeSignature,
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

    public getTimeSignature(): TimeSignature {
        return this.time;
    }

    public addMeasure(measure: Measure): void {
        this.measures.push(measure);
    }

    public getMeasures(): Measure[] {
        return this.measures;
    }

    public setScale(ratio: number) {
        this.scale = ratio;
    }

    public width(): number {
        return MEASURE_LENGTH * this.measures.length;
    }

    public getMeasureLengths(): number[] {
        return this.measures.map(m => m.sumOfTimes());
    }

    public toVextab(): string {
        this.measures.map(m => {
            if (m.sumOfTimes() != this.time.getBeatType())
                console.warn("Measure does not fulfill the time signature !");
        });
        return `options width=${this.width()} scale=${this.scale}\n` +
            `tabstave notation=${this.displayStave} tablature=${this.displayTablature}\n time=${this.time.toVextab()}\n` +
            this.measures.map(m => m.toVextab()).join("|\n");
    }

}

/**
 * Infos on the tempo of the song
 */
export class TimeSignature implements Item {
	/**
	 * @param {number} beats the numerator on the music sheet
	 * @param {number} beatType the denominator on the music sheet
	 */
    constructor(private beats: number, private beatType: number) {
    }

    public getBeats(): number {
        return this.beats;
    }

    public getBeatType(): number {
        return this.beatType;
    }

    public toVextab(): string {
        return `${this.beats}/${this.beatType}`;
    }
}

/**
 * A measure contains a certain amount of times.
 * This amount is determined by the time signature.
 */
export class Measure implements Item {
    private times: Time[] = [];

    public addTime(time: Time): void {
        this.times.push(time);
    }

    public getTimes(): Time[] {
        return this.times;
    }

	/**
	 * Calculates the cumulated duration of contained times
	 * @returns {number}
	 */
	public sumOfTimes(): number {
        return this.times
            .map(t => t.getDuration().value())
            .reduce((sum, current) => sum + current);
    }

    public toVextab(): string {
        return "  notes " + this.times.map(t => t.toVextab()).join(" ");
    }

    public notEmpty(): boolean {
        return this.times.length > 0;
    }
}

/**
 * A musical duration
 */
export class Duration implements Item {
    public static WHOLE = new Duration("whole", "w", 4);
    public static HALF_DOT = new Duration(undefined, "hd", 2 + 1);
    public static HALF = new Duration("half", "h", 2);
    public static QUARTER_DOT = new Duration(undefined, "qd", 1 + 1 / 2);
    public static QUARTER = new Duration("quarter", "q", 1);
    public static EIGHTH_DOT = new Duration(undefined, "8d", 1 / 2 + 1 / 4);
    public static EIGHTH = new Duration("eighth", "8", 1 / 2);
    public static T16_DOT = new Duration(undefined, "16d", 1 / 4 + 1 / 8);
    public static T16 = new Duration("16th", "16", 1 / 4);
    public static T32_DOT = new Duration(undefined, "32d", 1 / 8 + 1 / 16);
    public static T32 = new Duration("32nd", "32", 1 / 8);
    public static T64_DOT = new Duration(undefined, "64d", 1 / 16 + 1 / 32);
    public static T64 = new Duration("64th", "64", 1 / 16);
    public static T128_DOT = new Duration(undefined, "128d", 1 / 32 + 1 / 64);
    public static T128 = new Duration("128th", "128", 1 / 32);
    public static list: Duration[] = [
        Duration.WHOLE, Duration.HALF_DOT, Duration.HALF, Duration.QUARTER_DOT, Duration.QUARTER,
        Duration.EIGHTH_DOT, Duration.EIGHTH, Duration.T16_DOT, Duration.T16, Duration.T32_DOT,
        Duration.T32, Duration.T64_DOT, Duration.T64, Duration.T128_DOT, Duration.T128
    ];
    private constructor(private musicxml: string, public vextab: string, private val: number) {}

    public value(): number {
        return this.val;
    }

    public toVextab(): string {
        return this.vextab.toString();
    }

	/**
	 * Finds a Vexmxl duration based on the Vextab notation
	 * @param vt The vextab notation ("w", "h", "q", "8", etc.)
	 * @returns {undefined|Duration}
	 */
	public static fromVextab(vt: string): Duration {
		return Duration.list.filter((value, index, obj) => value.vextab === vt)[0];
	}
}

/**
 * A time is a music item (either a silence, a note, or a chord)
 */
export abstract class Time implements Item {
    constructor(private duration: Duration) {
    }

    public toVextab(): string {
        return `:${this.duration.toVextab()}${this.representation()}`;
    }

    public getDuration(): Duration {
        return this.duration;
    }

    public setDuration(duration: Duration) {
        this.duration = duration;
    }

    // Kind of dirty, but a nice compromise on broken instanceof of Typescript on imported type definitions
    public abstract isChord(): boolean;

    public abstract adaptPitch(modifier: number): void;

	/**
	 * Times representation to be used in the toVextab() call
	 * @returns {string}
	 */
	protected abstract representation(): string;
}

/**
 * A chord is a set of notes.
 */
export class Chord extends Time {
    private notes: Note[] = [];

	/**
	 * Vextab needs the notes to be sorted on strings for correct displaying
	 */
	private sortNotes(): void {
        this.notes.sort((a, b) => {
            return b.getString() - a.getString()
        });
    }

    public addNote(note: Note): void {
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

    public getNotes(): Note[] {
        return this.notes;
    }

    public notEmpty(): boolean {
        return this.notes.length > 0;
    }

    protected representation(): string {
        this.sortNotes();
        return `(${this.notes.map(n => n.toVextab()).join(".")})`;
    }

    public adaptPitch(modifier: number): void {
        for (let note of this.notes) {
            note.setPitch(modifier);
        }
    }

	public isChord() {
		return true;
	}

}

/**
 * A rest is a time silenced
 */
export class Rest extends Time {

	protected representation(): string {
        return "##";
    }

	public adaptPitch(modifier: number): void {
		// Do nothing
	}

	public isChord() {
		return false;
	}
}

/**
 * A note corresponds to a string pinched to a certain fret
 */
export class Note implements Item {
    private _pitch: number;
    private _bend: number;

    constructor(private fret: number, private str: number) {
        if (str <= 0 || str > 6) {
            throw new Error("A string is in the bounds [1, 6]");
        } else if (fret < 0 || fret > 24) {
            throw new Error("A fret is in the bounds [0, 24]");
        }

        this._pitch = 0;
        this._bend = 0;
    }

    public toVextab(): string {
        let b = '';
        if (this._bend > 0) {
            b = `b${this.fret + this._bend}`;
        }
        return `${(this.fret)}${b}/${this.str}`;
    }

    public getFret(): number {
        return this.fret;
    }

    public getString(): number {
        return this.str;
    }

    public setPitch(modifier: number): void {
        this._pitch = modifier;
    }

    public getPitch(): number {
    	return this._pitch;
    }

    public bend(amount: number): void {
        if (amount > 0) {
            this._bend = amount;
        } else {
            throw new Error("A bend must be strictly positive");
        }
    }

    public hasBend(): boolean {
        return this._bend > 0;
    }

	/**
	 * Gives if the note is a sharp/bemol note
	 * @returns {boolean}
	 */
	public hasSharp(): boolean {
	    let wrap: any[] = vextab.getNoteForFret(this.fret, this.str);
	    let note: string = wrap[0];
        return note.indexOf("#") > 0;
    }

}

