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
        toString(): string;
    }
    class VexmxlMeasure implements VextabItem {
        private times;
        addTime(time: VexmxlTime): void;
        toString(): string;
        notEmpty(): boolean;
    }
    abstract class VexmxlTime implements VextabItem {
        private duration;
        constructor(duration: string);
        toString(): string;
        setDuration(duration: string): void;
        protected abstract representation(): string;
    }
    class VexmxlChord extends VexmxlTime {
        private notes;
        addNote(note: VexmxlNote): void;
        notEmpty(): boolean;
        protected representation(): string;
    }
    class VexmxlRest extends VexmxlTime {
        protected representation(): string;
    }
    class VexmxlNote implements VextabItem {
        private fret;
        private str;
        constructor(fret: number, str: number);
        toString(): string;
    }
}
