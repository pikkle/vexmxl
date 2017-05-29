import {parseScore, ScorePart, ScoreTimewise} from "musicxml-interfaces";
import Renderer = Vex.Flow.Renderer;
import RuntimeError = Vex.RuntimeError;
import {Chord} from "./tabs/Chord";
import {Measure} from "./tabs/Measure";
import {Note} from "./tabs/Note";
import {Rest} from "./tabs/Rest";
import {Tablature} from "./tabs/Tablature";
import {TimeSignature} from "./tabs/TimeSignature";

class ParseError extends Error {
}

export function parseXML(path: string, div: HTMLElement): void {
	fetch(path)
		.then((response: Body) => {
			return response.text();
		})
		.then((score: string) => {
			let doc: ScoreTimewise = parseScore(score);
			console.log("Converted XML to ", doc);

			let renderer: Renderer = new Renderer(div, Renderer.Backends.SVG);

			let artist: Artist = new Artist(10, 10, 600, {scale: 0.8});
			let vt: VexTab = new VexTab(artist);

			let partName: string = (<ScorePart>doc.partList[0]).id; // TODO: let the part choice to the user

			let timeSignature: TimeSignature = new TimeSignature(doc.measures[0].parts[partName][1].divisions);

			let tab = new Tablature();

			let time: number = timeSignature.getBase();

			for (let docMeasure of doc.measures) {
				let measure = new Measure();
				let chord: Chord;

				for (let note of docMeasure.parts[partName]) {
					if (note.hasOwnProperty("rest")) {
						if (chord && chord.notEmpty()) {
							measure.addTime(chord);
							chord = undefined;

						}
						measure.addTime(new Rest(timeSignature.durationToTag(note.duration)));

					} else if (note.hasOwnProperty("pitch")) {
						let tech = note.notations[0].technicals[0];

						if (note.hasOwnProperty("chord")) {
							if (!chord) {
								throw new ParseError("Chord element has not been initialized properly");
							}

						} else {
							if (chord && chord.notEmpty()) {
								measure.addTime(chord);
							}
							chord = new Chord(timeSignature.durationToTag(note.duration));
						}
						chord.addNote(new Note(tech.fret.fret, tech.string.stringNum));

					}
					time = note.duration;

				}
				if (measure.notEmpty()) {
					tab.addMeasure(measure);

				}

			}

			try {
				let parsed = tab.toString();
				console.log(parsed);
				vt.parse(parsed);
				artist.render(renderer);
			} catch (e) {
				console.log(e);
			}
		});
}

parseXML("../test/back_in_black.xml", document.getElementById("display"));
