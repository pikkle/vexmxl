import "vexflow";
import {} from "../src/vextab";
import Renderer = Vex.Flow.Renderer;
import {displayTablature, generateImage, generateSVG, parseXMLFromFile, parseXMLFromString} from "../src/vexmxl";
import {Tablature} from "../src/vexmxl.tab";
import "jszip";

/*
parseXMLFromFile("../support/Back In Black2.xml", true, true).then(tab => {
	console.log(tab);
	console.log(tab.toString());
	let img = generateImage(tab);
	document.getElementById("display").appendChild(img);
});
*/

let zip = new JSZip();

fetch("http://localhost:8000/uploads/mxl/479e36af-d5fa-4af5-b287-feed9cb4e95c.mxl").then((response: Response) => {
	return response.blob();
}).then((blob: Blob) => {
	zip.loadAsync(blob).then(jszip => {
		jszip.file("META-INF\/container.xml").async("string").then((containerFile: string) => {
			let mainFilename = new DOMParser().parseFromString(containerFile, "application/xml").getElementsByTagName("rootfile")[0].getAttribute("full-path");
			jszip.file(mainFilename).async("string").then(musicxmlString => {
				parseXMLFromString(musicxmlString, true).then((tab: Tablature) => {
					let div = document.createElement("div");
					let vextab: VexTab = displayTablature(tab, div, false);
					vextab.getArtist().staves[0].tab_notes.forEach(note => {
						console.log(note.getAbsoluteX());
					});
				});
			});
		});
	});
});