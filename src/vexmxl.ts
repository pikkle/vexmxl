import * as mxl from "musicxml-interfaces";
import "vexflow";
import Renderer = Vex.Flow.Renderer;
import {Tablature, TimeSignature, Chord, Duration, Measure, Note, Rest} from "./vexmxl.tab";

class ParseError extends Error {
}

let timeMap: { [key: number]: Duration } = {
	4: Duration.WHOLE,
	3: Duration.HALF_DOT,
	2: Duration.HALF,
	1.5: Duration.QUARTER_DOT,
	1: Duration.QUARTER,
	0.75: Duration.EIGHTH_DOT,
	0.5: Duration.EIGHTH,
	0.375: Duration.T16_DOT,
	0.25: Duration.T16,
	0.1875: Duration.T32_DOT,
	0.125: Duration.T32,
	0.09375: Duration.T64_DOT,
	0.0625: Duration.T64
};

function displayTablature(tab: Tablature, div: HTMLElement, canvas: boolean): VexTab {
	let artist: Artist = new Artist(0, 0, tab.width());
	let vt: VexTab = new VexTab(artist);
	let renderer: Renderer = new Renderer(div, canvas ? Renderer.Backends.CANVAS : Renderer.Backends.SVG);
	let parsed = tab.toString();

	try {
		vt.parse(parsed);
		console.debug(vt);
		artist.render(renderer);
		console.debug(artist);
	} catch (e) {
		console.error(e);
	}

	return vt;
}

export function generateSVG(tab: Tablature): SVGElement {
	let div = document.createElement("div");
	displayTablature(tab, div, false);
	return div.children[0] as SVGElement;
}

export function generateCanvas(tab: Tablature): HTMLCanvasElement {
	let canvas = document.createElement("canvas");
	console.warn("Canvas size is limited, e.g. Chrome's canvas can only be 32,767x32,767 pixels. " +
		"If it exceeds, nothing will be displayed.");
	displayTablature(tab, canvas, true);
	return canvas;
}

export function generateImage(tab: Tablature): HTMLImageElement {
	let svg = generateSVG(tab); // uses SVG rendering instead of canvas because of size limitations
	let svgData = new XMLSerializer().serializeToString(svg);
	let data = "data:image/svg+xml;base64," + btoa(svgData);
	let img = document.createElement("img");

	img.setAttribute('src', data);
	return img;
}

function parseXML(xml: string, displayTab: boolean, displayStave: boolean): Promise<Tablature> {
	return Promise.resolve(xml).then((score: string) => {
		let doc: mxl.ScoreTimewise = mxl.parseScore(score);
		console.debug(doc);

		let partName: string = (doc.partList[0] as mxl.ScorePart).id; // TODO: let the part choice to the user
		let times: mxl.Time;
		let metronome: mxl.Metronome;
		for (let obj of doc.measures[0].parts[partName]) {
			if (obj.hasOwnProperty("directionTypes")) {
				metronome = obj.directionTypes[0].metronome;
			}
			if (obj.hasOwnProperty("times")) {
				times = obj.times[0];
			}
		}
		let bpm = +metronome.perMinute.data;

		let title: string = doc.movementTitle;
		let time = new TimeSignature(+times.beats[0], times.beatTypes[0]);
		let divisions = 1; // Number of notes in measure
		let tab = new Tablature(title, time, bpm, displayTab, displayStave);
		for (let docMeasure of doc.measures) {
			let measure = new Measure();
			let chord: Chord;

			for (let elem of docMeasure.parts[partName]) {
				if (elem._class === "Attributes") {
					let attributes = elem as mxl.Attributes;
					if (attributes.divisions) {
						divisions = attributes.divisions;
					}

				} else if (elem._class === "Note") {
					let note = elem as mxl.Note;
					let duration = timeMap[1 / divisions * note.duration];
					if (note.rest) {
						if (chord && chord.notEmpty()) {
							measure.addTime(chord);
							chord = undefined; // for next note
						}
						measure.addTime(new Rest(duration));

					} else if (note.pitch) {
						let tech = note.notations[0].technicals[0];

						if (note.chord) {
							if (!chord) throw new ParseError("Chord element has not been initialized properly");
						} else {
							if (chord && chord.notEmpty()) {
								measure.addTime(chord);
							}
							chord = new Chord(duration);
						}
						let vNote = new Note(tech.fret.fret, tech.string.stringNum);

						if (tech.bend) {
							vNote.bend(+tech.bend.bendAlter);
						}
						chord.addNote(vNote);
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

export function parseXMLFromString(xml: string, displayTab: boolean = true, displayStave: boolean = true): Promise<Tablature> {
	return Promise.resolve(xml).then(str => {
		return parseXML(str, displayTab, displayStave);
	});
}

export function parseXMLFromFile(path: string, displayTab: boolean = true, displayStave: boolean = true): Promise<Tablature> {
	return fetch(path).then((response: Body) => {
		return response.text();
	}).then(str => {
		return parseXML(str, displayTab, displayStave);
	});
}
