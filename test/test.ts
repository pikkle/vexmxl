import "vexflow";
import {} from "../src/vextab";
import Renderer = Vex.Flow.Renderer;
import {generateImage, generateSVG, parseXMLFromFile, parseXMLFromString} from "../src/vexmxl";
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

fetch("http://localhost:8000/uploads/mxl/b9a20256-00e7-42ca-8f27-e01ccf5d55ce.mxl").then((response: Response) => {
	return response.blob();
}).then((blob: Blob) => {
	zip.loadAsync(blob).then(jszip => {
		jszip.file(/[a-z0-9-]*(\/META-INF\/container.xml)/)[0].async("string").then((containerFile: string) => {
			let mainFilename = new DOMParser().parseFromString(containerFile, "application/xml").getElementsByTagName("rootfile")[0].getAttribute("full-path");
			let regexp = new RegExp(`[a-z0-9-]*(\/${mainFilename})`);
			jszip.file(regexp)[0].async("string").then(musicxmlString => {
				parseXMLFromString(musicxmlString, true).then((tab: Tablature) => {
					let img = generateImage(tab);
					document.getElementById("display").appendChild(img);
				});
			});
		});
	});
});