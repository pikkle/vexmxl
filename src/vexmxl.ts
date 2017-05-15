///<reference path="../node_modules/@types/vexflow/index.d.ts"/>
import {parseScore, ScorePart, ScoreTimewise} from "musicxml-interfaces";
import Renderer = Vex.Flow.Renderer;
import RuntimeError = Vex.RuntimeError;

class TimeDivision {
	private base: number;
	private table: Map<number, string> = new Map();

	constructor(base: number) {
		this.base = base;
		this.table.set(base * 4,        'w');
		this.table.set(base * 3,        'hd');
		this.table.set(base * 2,        'h');
		this.table.set(base * (3/2.),   'qd');
		this.table.set(base,            'q');
		this.table.set(base * (3/4.),   '8d');
		this.table.set(base * (1/2.),   '8');
		this.table.set(base * (3/8.),   '16d');
		this.table.set(base * (1/4.),   '16');
		this.table.set(base * (3/16.),  '32d');
		this.table.set(base * (1/8.),   '32');
	}

	durationToTag(duration: number): string {
		let ret: string = this.table.get(duration);
		if (!ret) {
			let differences: number[] = Array.from(this.table.keys()).map(k => Math.abs(duration - k));
			return this.durationToTag(differences.indexOf(Math.min(...differences)));
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
				let streak = false;
				let notes: string[] = [];
				let chord: string[] = [];
				for (let note of measure.parts[partName]) {
					if (note.hasOwnProperty('rest')) {
						notes.push(divisions.durationToTag(note.duration) + " ## ");
					} else if (note.hasOwnProperty('pitch')) {
						let tech = note.notations[0].technicals[0];
						if (note.hasOwnProperty('chord')) {
							streak = true;
							chord.push(tech.fret.fret + "/" + tech.string.stringNum);
						} else {
							if (chord.length > 0) {
								notes.push("(" + chord.join('.') + ")");
							}
							chord = [];
							streak = false;
							chord.push(tech.fret.fret + "/" + tech.string.stringNum);
						}

					}

				}
				if (notes.length > 0) {
					parsed += measureParsed + notes.join(' ') + "\n";
				}
			}

			console.log(parsed);

			try {
				vt.parse(parsed);
				artist.render(renderer);
			} catch (e) {
				console.log(e);
			}
		});
}

parseXML('../test/back_in_black.xml', document.getElementById("display"));
