import { VexmxlNote } from "./VexmxlNote";
import { VexmxlTime } from "./VexmxlTime";
export declare class VexmxlChord extends VexmxlTime {
    private notes;
    addNote(note: VexmxlNote): void;
    notEmpty(): boolean;
    protected representation(): string;
}
