export declare class TimeSignature {
    private base;
    private table;
    constructor(base: number);
    durationToTag(duration: number): string;
    getBase(): number;
}
