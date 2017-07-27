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
/**
 * Top class that represents the whole tablature.
 */
export declare class Tablature implements Item {
    private title;
    private time;
    private bpm;
    private displayTablature;
    private displayStave;
    private scale;
    private measures;
    constructor(title: string, time: TimeSignature, bpm: number, displayTablature?: boolean, displayStave?: boolean, scale?: number);
    getTitle(): string;
    getBPM(): number;
    getTimeSignature(): TimeSignature;
    addMeasure(measure: Measure): void;
    getMeasures(): Measure[];
    setScale(ratio: number): void;
    width(): number;
    getMeasureLengths(): number[];
    toVextab(): string;
}
/**
 * Infos on the tempo of the song
 */
export declare class TimeSignature implements Item {
    private beats;
    private beatType;
    /**
     * @param {number} beats the numerator on the music sheet
     * @param {number} beatType the denominator on the music sheet
     */
    constructor(beats: number, beatType: number);
    getBeats(): number;
    getBeatType(): number;
    toVextab(): string;
}
/**
 * A measure contains a certain amount of times.
 * This amount is determined by the time signature.
 */
export declare class Measure implements Item {
    private times;
    addTime(time: Time): void;
    getTimes(): Time[];
    /**
     * Calculates the cumulated duration of contained times
     * @returns {number}
     */
    sumOfTimes(): number;
    toVextab(): string;
    notEmpty(): boolean;
}
/**
 * A musical duration
 */
export declare class Duration implements Item {
    private musicxml;
    vextab: string;
    private val;
    static WHOLE: Duration;
    static HALF_DOT: Duration;
    static HALF: Duration;
    static QUARTER_DOT: Duration;
    static QUARTER: Duration;
    static EIGHTH_DOT: Duration;
    static EIGHTH: Duration;
    static T16_DOT: Duration;
    static T16: Duration;
    static T32_DOT: Duration;
    static T32: Duration;
    static T64_DOT: Duration;
    static T64: Duration;
    static T128_DOT: Duration;
    static T128: Duration;
    static list: Duration[];
    private constructor();
    value(): number;
    toVextab(): string;
    /**
     * Finds a Vexmxl duration based on the Vextab notation
     * @param vt The vextab notation ("w", "h", "q", "8", etc.)
     * @returns {undefined|Duration}
     */
    static fromVextab(vt: string): Duration;
}
/**
 * A time is a music item (either a silence, a note, or a chord)
 */
export declare abstract class Time implements Item {
    private duration;
    constructor(duration: Duration);
    toVextab(): string;
    getDuration(): Duration;
    setDuration(duration: Duration): void;
    abstract isChord(): boolean;
    abstract adaptPitch(modifier: number): void;
    /**
     * Times representation to be used in the toVextab() call
     * @returns {string}
     */
    protected abstract representation(): string;
}
/**
 * A chord is a set of notes.
 */
export declare class Chord extends Time {
    private notes;
    /**
     * Vextab needs the notes to be sorted on strings for correct displaying
     */
    private sortNotes();
    addNote(note: Note): void;
    private hasNote(string);
    getNotes(): Note[];
    notEmpty(): boolean;
    protected representation(): string;
    adaptPitch(modifier: number): void;
    isChord(): boolean;
}
/**
 * A rest is a time silenced
 */
export declare class Rest extends Time {
    protected representation(): string;
    adaptPitch(modifier: number): void;
    isChord(): boolean;
}
/**
 * A note corresponds to a string pinched to a certain fret
 */
export declare class Note implements Item {
    private fret;
    private str;
    private _pitch;
    private _bend;
    constructor(fret: number, str: number);
    toVextab(): string;
    getFret(): number;
    getString(): number;
    setPitch(modifier: number): void;
    getPitch(): number;
    bend(amount: number): void;
    hasBend(): boolean;
    /**
     * Gives if the note is a sharp/bemol note
     * @returns {boolean}
     */
    hasSharp(): boolean;
}
