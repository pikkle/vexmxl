import {Attributes, Note, parseScore, ScorePart, ScoreTimewise} from "musicxml-interfaces";
import Renderer = Vex.Flow.Renderer;
import RuntimeError = Vex.RuntimeError;
import {VexMxlTab} from "./vexmxl.tab";
import VexmxlDuration = VexMxlTab.VexmxlDuration;

class ParseError extends Error {
}

let qd = 5 + 1 / 3;
let timeMap: {[key: number]: VexmxlDuration} = { // TODO: fix times, a half dotted is longer than a half...
	1: VexmxlDuration.WHOLE,
	2: VexmxlDuration.HALF,
	3: VexmxlDuration.HALF_DOT,
	4: VexmxlDuration.QUARTER,
	8: VexmxlDuration.EIGHTH,
	12: VexmxlDuration.EIGHTH_DOT,
	16: VexmxlDuration.SIXTEENTH,
	24: VexmxlDuration.SIXTEENTH_DOT,
	32: VexmxlDuration.THIRTYSECOND,
};
timeMap[qd] = VexmxlDuration.QUARTER_DOT;

export namespace VexMxl {

	export function displayTablature(tab: VexMxlTab.VexmxlTablature, div: HTMLElement): void {
		let artist: Artist = new Artist(10, 10, 600, {scale: 0.8});
		let vt: VexTab = new VexTab(artist);
		let renderer: Renderer = new Renderer(div, Renderer.Backends.SVG);
		let parsed = tab.toString();

		try {
			vt.parse(parsed);
			artist.render(renderer);
		} catch (e) {
			console.error(e);
		}
	}

	export function parseXML(path: string): Promise<VexMxlTab.VexmxlTablature> {
		return fetch(path)
			.then((response: Body) => {
				return response.text();
			})
			.then((score: string) => {
				let doc: ScoreTimewise = parseScore(score);
				let partName: string = (doc.partList[0] as ScorePart).id; // TODO: let the part choice to the user

				// let timeSignature: TimeSignature = new TimeSignature(doc.measures[0].parts[partName][1].divisions);
				let bpm = doc.measures[0].parts[partName][1].directionTypes[0].metronome.perMinute.data;

				let divisions = 1; // Number of notes in measure
				let tab = new VexMxlTab.VexmxlTablature();

				for (let docMeasure of doc.measures) {
					let measure = new VexMxlTab.VexmxlMeasure();
					let chord: VexMxlTab.VexmxlChord;

					for (let elem of docMeasure.parts[partName]) {
						if (elem._class === "Attributes") {
							let attributes = elem as Attributes;
							if (attributes.divisions) {
								divisions = attributes.divisions;
							}

						} else if (elem._class === "Note") {
							let note = elem as Note;
							let duration = timeMap[1 / (note.duration / (divisions * 4))];

							if (note.rest) {
								if (chord && chord.notEmpty()) {
									measure.addTime(chord);
									chord = undefined;
								}
								measure.addTime(new VexMxlTab.VexmxlRest(duration));

							} else if (note.pitch) {
								let tech = note.notations[0].technicals[0];

								if (note.chord) {
									if (!chord) throw new ParseError("Chord element has not been initialized properly");
								} else {
									if (chord && chord.notEmpty()) {
										measure.addTime(chord);
									}
									chord = new VexMxlTab.VexmxlChord(duration);
								}
								chord.addNote(new VexMxlTab.VexmxlNote(tech.fret.fret, tech.string.stringNum));
							} else {
								throw new ParseError("note has not been recognized");
							}

						}

					}

					if (chord && chord.notEmpty()) {
						measure.addTime(chord);
					}

					if (measure.notEmpty()) {
						tab.addMeasure(measure);
					}

				}

				return tab;
			});
	}
}
