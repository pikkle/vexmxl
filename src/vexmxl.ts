///<reference path="../node_modules/@types/vexflow/index.d.ts"/>
import {parseScore, ScorePart, ScoreTimewise, serializeScore} from "musicxml-interfaces";
import Renderer = Vex.Flow.Renderer;


export function parseXML(path: string, div: HTMLElement) : void {
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

			let parsed: string = "tabstave\nnotation=false\nkey=A\ntime=4/4\n";

			let divisions: number = doc.measures[0].parts[partName][1].divisions;
			let timingDivisions = {};


			for (let measure of doc.measures) {
				let measureParsed = "notes ";
				for (let truc of measure.parts[partName]) {
					console.log(truc);
					if (truc.hasOwnProperty('rest')) {
						measureParsed += "## ";
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

parseXML('../support/a.xml', document.getElementById("display"));
