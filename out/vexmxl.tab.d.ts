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
    class VexmxlDuration implements VextabItem {
        private representation;
        static WHOLE: VexmxlDuration;
        static HALF: VexmxlDuration;
        static HALF_DOT: VexmxlDuration;
        static QUARTER: VexmxlDuration;
        static QUARTER_DOT: VexmxlDuration;
        static EIGHTH: VexmxlDuration;
        static EIGHTH_DOT: VexmxlDuration;
        static SIXTEENTH: VexmxlDuration;
        static SIXTEENTH_DOT: VexmxlDuration;
        static THIRTYSECOND: VexmxlDuration;
        private constructor(representation);
        toString(): string;
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
