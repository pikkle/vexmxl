export declare namespace VexMxlTab {
    interface VextabItem {
        toString(): string;
    }
    class VexmxlTablature implements VextabItem {
        private title;
        private time;
        private bpm;
        private displayTablature;
        private displayStave;
        private _scale;
        private measures;
        constructor(title: string, time: VexmxlTimeSignature, bpm: number, displayTablature?: boolean, displayStave?: boolean, _scale?: number);
        getTitle(): string;
        getBPM(): number;
        addMeasure(measure: VexmxlMeasure): void;
        getMeasures(): VexmxlMeasure[];
        scale(ratio: number): void;
        width(): number;
        getMeasureLengths(): number[];
        toString(): string;
    }
    class VexmxlTimeSignature implements VextabItem {
        private beats;
        private beatType;
        constructor(beats: number, beatType: number);
        getBeats(): number;
        getBeatType(): number;
        toString(): string;
    }
    class VexmxlMeasure implements VextabItem {
        private times;
        addTime(time: VexmxlTime): void;
        getTimes(): VexmxlTime[];
        sumOfTimes(): number;
        toString(): string;
        notEmpty(): boolean;
    }
    class VexmxlDuration {
        private musicxml;
        private vextab;
        private val;
        static WHOLE: VexmxlDuration;
        static HALF_DOT: VexmxlDuration;
        static HALF: VexmxlDuration;
        static QUARTER_DOT: VexmxlDuration;
        static QUARTER: VexmxlDuration;
        static EIGHTH_DOT: VexmxlDuration;
        static EIGHTH: VexmxlDuration;
        static T16_DOT: VexmxlDuration;
        static T16: VexmxlDuration;
        static T32_DOT: VexmxlDuration;
        static T32: VexmxlDuration;
        static T64_DOT: VexmxlDuration;
        static T64: VexmxlDuration;
        static T128_DOT: VexmxlDuration;
        static T128: VexmxlDuration;
        private constructor();
        static fromMusicxml(musicxml: string): VexmxlDuration;
        value(): number;
        toString(): string;
    }
    abstract class VexmxlTime implements VexMxlTab.VextabItem {
        private duration;
        constructor(duration: VexMxlTab.VexmxlDuration);
        toString(): string;
        getDuration(): VexMxlTab.VexmxlDuration;
        setDuration(duration: VexMxlTab.VexmxlDuration): void;
        adaptPitch(modifier: number): void;
        protected abstract representation(): string;
    }
    class VexmxlChord extends VexmxlTime {
        private notes;
        private sortNotes();
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
        private _pitch;
        private _bend;
        constructor(fret: number, str: number);
        toString(): string;
        getFret(): number;
        getString(): number;
        pitch(modifier: number): void;
        bend(amount: number): void;
    }
}
