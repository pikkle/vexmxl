import {Attributes, Metronome, Note, parseScore, ScorePart, ScoreTimewise, Time} from "musicxml-interfaces";
import {VexMxlTab} from "./vexmxl.tab";
import VexmxlDuration = VexMxlTab.VexmxlDuration;
import "vexflow";
import Renderer = Vex.Flow.Renderer;
class ParseError extends Error {
}

let timeMap: { [key: number]: VexmxlDuration } = {
	4: VexmxlDuration.WHOLE,
	3: VexmxlDuration.HALF_DOT,
	2: VexmxlDuration.HALF,
	1.5: VexmxlDuration.QUARTER_DOT,
	1: VexmxlDuration.QUARTER,
	0.75: VexmxlDuration.EIGHTH_DOT,
	0.5: VexmxlDuration.EIGHTH,
	0.375: VexmxlDuration.T16_DOT,
	0.25: VexmxlDuration.T16,
	0.1875: VexmxlDuration.T32_DOT,
	0.125: VexmxlDuration.T32,
	0.09375: VexmxlDuration.T64_DOT,
	0.0625: VexmxlDuration.T64
};

export namespace VexMxl {

	import VexmxlTimeSignature = VexMxlTab.VexmxlTimeSignature;

	function displayTablature(tab: VexMxlTab.VexmxlTablature, div: HTMLElement, canvas: boolean): void {
		let artist: Artist = new Artist(0, 0, tab.width());
		artist.NOLOGO = true;
		let vt: VexTab = new VexTab(artist);
		let renderer: Renderer = new Renderer(div, canvas ? Renderer.Backends.CANVAS : Renderer.Backends.SVG);
		let parsed = tab.toString();

		try {
			vt.parse(parsed);
			artist.render(renderer);
		} catch (e) {
			console.error(e);
		}
	}

	export function generateSVG(tab: VexMxlTab.VexmxlTablature): SVGElement {
		let div = document.createElement("div");
		displayTablature(tab, div, false);
		return div.children[0] as SVGElement;
	}

	export function generateCanvas(tab: VexMxlTab.VexmxlTablature): HTMLCanvasElement {
		let canvas = document.createElement("canvas");
		displayTablature(tab, canvas, true);
		return canvas;
	}

	export function generateImage(tab: VexMxlTab.VexmxlTablature): HTMLImageElement {
        let svg = generateSVG(tab);
        let svgData = new XMLSerializer().serializeToString( svg );
        let data = "data:image/svg+xml;base64," + btoa(svgData);
        let img = document.createElement("img");

        img.setAttribute('src', data);
        return img;
	}


	export function parseXML(path: string, displayTab: boolean = true, displayStave: boolean = true): Promise<VexMxlTab.VexmxlTablature> {
		return fetch(path)
			.then((response: Body) => {
				return response.text();
			})
			.then((score: string) => {
				let doc: ScoreTimewise = parseScore(score);
				console.debug(doc);

				let partName: string = (doc.partList[0] as ScorePart).id; // TODO: let the part choice to the user
				let metronome: Metronome = doc.measures[0].parts[partName][1].directionTypes[0].metronome;
				let times: Time = doc.measures[0].parts[partName][0].times[0];
				let bpm = +metronome.perMinute.data;

				let title: string = doc.movementTitle;
				let time: VexmxlTimeSignature = new VexmxlTimeSignature(+times.beats[0], times.beatTypes[0]);
				let divisions = 1; // Number of notes in measure
				let tab = new VexMxlTab.VexmxlTablature(title, time, bpm, displayTab, displayStave);
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

							let duration = timeMap[1/divisions * note.duration];


							if (note.rest) {
								if (chord && chord.notEmpty()) {
									measure.addTime(chord);
									chord = undefined; // for next note
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
								let vNote = new VexMxlTab.VexmxlNote(tech.fret.fret, tech.string.stringNum);

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
}
