import {Time} from "./Time";
import {Note} from "./Note";
export class Chord extends Time {
	private notes: Note[] = [];

	addNote(note: Note): void {
		this.notes.push(note);
	}

	notEmpty(): boolean {
		return this.notes.length > 0;
	}

	representation(): string {
		return "(" + this.notes.join ('.') + ")";
	}
}