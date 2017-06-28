export declare namespace VexMxlTab {
    interface VextabItem {
        toString(): string;
    }
    class VexmxlTablature implements VextabItem {
        private displaySheet;
        private scale;
        private measures;
        constructor(displaySheet?: boolean, scale?: number);
        addMeasure(measure: VexmxlMeasure): void;
        getMeasures(): VexmxlMeasure[];
        displayMusicSheet(b: boolean): void;
        displayScale(ratio: number): void;
        width(): number;
        toString(): string;
    }
    class VexmxlMeasure implements VextabItem {
        private times;
        addTime(time: VexmxlTime): void;
        getTimes(): VexmxlTime[];
        toString(): string;
        notEmpty(): boolean;
    }
    enum VexmxlDuration {
        WHOLE = "w",
        HALF = "h",
        HALF_DOT = "hd",
        QUARTER = "q",
        QUARTER_DOT = "qd",
        EIGHTH = "8",
        EIGHTH_DOT = "8d",
        SIXTEENTH = "16",
        SIXTEENTH_DOT = "16d",
        THIRTYSECOND = "32",
    }
    abstract class VexmxlTime implements VextabItem {
        private duration;
        constructor(duration: VexmxlDuration);
        toString(): string;
        getDuration(): VexmxlDuration;
        setDuration(duration: VexmxlDuration): void;
        adaptPitch(modifier: number): void;
        protected abstract representation(): string;
    }
    class VexmxlChord extends VexmxlTime {
        private notes;
        addNote(note: VexmxlNote): void;
        private hasNote(string);
        getNotes(): VexmxlNote[];
        notEmpty(): boolean;
        protected representation(): string;
        adaptPitch(modifier: number): void;
    }
    class VexmxlRest extends VexmxlTime {
        protected representation(): string;
    }
    class VexmxlNote implements VextabItem {
        private fret;
        private str;
        private modifier;
        constructor(fret: number, str: number);
        toString(): string;
        getFret(): number;
        getString(): number;
        adaptPitch(modifier: number): void;
    }
}
