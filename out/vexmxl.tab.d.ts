export interface Item {
    toString(): string;
}
export declare class Tablature implements Item {
    private title;
    private time;
    private bpm;
    private displayTablature;
    private displayStave;
    private _scale;
    private measures;
    constructor(title: string, time: TimeSignature, bpm: number, displayTablature?: boolean, displayStave?: boolean, _scale?: number);
    getTitle(): string;
    getBPM(): number;
    addMeasure(measure: Measure): void;
    getMeasures(): Measure[];
    scale(ratio: number): void;
    width(): number;
    getMeasureLengths(): number[];
    toString(): string;
}
export declare class TimeSignature implements Item {
    private beats;
    private beatType;
    constructor(beats: number, beatType: number);
    getBeats(): number;
    getBeatType(): number;
    toString(): string;
}
export declare class Measure implements Item {
    private times;
    addTime(time: Time): void;
    getTimes(): Time[];
    sumOfTimes(): number;
    toString(): string;
    notEmpty(): boolean;
}
export declare class Duration {
    private musicxml;
    private vextab;
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
    private constructor();
    value(): number;
    toString(): string;
}
export declare abstract class Time implements Item {
    private duration;
    constructor(duration: Duration);
    toString(): string;
    getDuration(): Duration;
    setDuration(duration: Duration): void;
    abstract isChord(): boolean;
    abstract adaptPitch(modifier: number): void;
    protected abstract representation(): string;
}
export declare class Chord extends Time {
    private notes;
    private sortNotes();
    addNote(note: Note): void;
    private hasNote(string);
    getNotes(): Note[];
    notEmpty(): boolean;
    protected representation(): string;
    adaptPitch(modifier: number): void;
    isChord(): boolean;
}
export declare class Rest extends Time {
    protected representation(): string;
    adaptPitch(modifier: number): void;
    isChord(): boolean;
}
export declare class Note implements Item {
    private fret;
    private str;
    private _pitch;
    private _bend;
    constructor(fret: number, str: number);
    toString(): string;
    getFret(): number;
    getString(): number;
    pitch(modifier: number): void;
    bend(amount: number): void;
    hasBend(): boolean;
}
