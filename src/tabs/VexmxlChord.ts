import {VexmxlNote} from "./VexmxlNote";
import {VexmxlTime} from "./VexmxlTime";
export class VexmxlChord extends VexmxlTime {
	private notes: VexmxlNote[] = [];

	public addNote(note: VexmxlNote): void {
		this.notes.push(note);
	}

	public notEmpty(): boolean {
		return this.notes.length > 0;
	}

	public representation(): string {
		return "(" + this.notes.join (".") + ")";
	}

}
