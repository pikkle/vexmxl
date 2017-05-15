///<reference path="../node_modules/@types/vexflow/index.d.ts"/>
import {parseScore, ScorePart, ScoreTimewise} from "musicxml-interfaces";
import Renderer = Vex.Flow.Renderer;
import RuntimeError = Vex.RuntimeError;

class TimeDivision {
	private base: number;
	private table: Map<number, string> = new Map();

	constructor(base: number) {
		this.base = base;
		this.table.set(base * 4, 'w');
		this.table.set(base * 2, 'h');
		this.table.set(base, 'q');
		this.table.set(base / 2, '8');
		this.table.set(base / 4, '16');
		this.table.set(base / 8, '32');

	}

	durationToTag(duration: number): string {
		let ret: string = this.table.get(duration);
		if (!ret) {
			console.error("Invalid duration " + duration + " for base quarter of " + this.base);
			throw new EvalError("duration is not valid");
		}
		return ":" + ret;
	}
}


export function parseXML(path: string, div: HTMLElement): void {
	fetch(path)
		.then((response: Body) => {
			return response.text();
		})
		.then((score: string) => {
			let doc: ScoreTimewise = parseScore(score);
			console.log('Converted XML to ', doc);

			let renderer: Renderer = new Renderer(div, Renderer.Backends.SVG);

			let artist: Artist = new Artist(10, 10, 600, {scale: 0.8});
			let vt: VexTab = new VexTab(artist);

			let partName: string = (<ScorePart>doc.partList[0]).id; // TODO: let the part choice to the user

			let parsed: string = "";

			let divisions: TimeDivision = new TimeDivision(doc.measures[0].parts[partName][1].divisions);


			for (let measure of doc.measures) {
				let measureParsed = "tabstave notation=true\n  notes ";
				let isChord = false;
				let chord: string[] = [];
				for (let truc of measure.parts[partName]) {
					console.log(truc);
					if (truc.hasOwnProperty('rest')) {
						try {
							measureParsed += divisions.durationToTag(truc.duration) + " ## ";
						} catch (e) {

						}
					}
					else if (truc.hasOwnProperty('pitch')) {
						if (truc.hasOwnProperty('chord')) {
							isChord = true;
							chord.push(truc.notations[0].technicals[0].fret.fret + "/" + truc.notations[0].technicals[0].string.stringNum);
						} else {
							if (isChord) {
								measureParsed += "(" + chord.join('.') + ")";
								isChord = false;
								chord = [];
							}
							try {
								measureParsed += divisions.durationToTag(truc.duration) + " " + truc.notations[0].technicals[0].fret.fret + "/" + truc.notations[0].technicals[0].string.stringNum
							} catch (e) {

							}
						}


					}

				}
				parsed += measureParsed + "\n";
			}

			try {
				vt.parse(parsed);
				artist.render(renderer);
			} catch (e) {
				console.log(e);
			}
		});
}

parseXML('../test/back_in_black.xml', document.getElementById("display"));
