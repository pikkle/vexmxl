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
fetch("http://localhost:8000/uploads/mxl/302e626c-8f53-470d-b057-0e5e8253d6f0.mxl").then((response: Response) => {
	return response.blob();
}).then((blob: Blob) => {
	zip.loadAsync(blob).then(jszip => {
		jszip.forEach((relativePath, file) => {
			if (relativePath !== "META-INF/container.xml") {
				console.log(`Unzipped file ${relativePath}`);
				file.async("string").then((litteralTablature: string) => {
					parseXMLFromString(litteralTablature, true).then((tab: Tablature) => {
						let img = generateImage(tab);
						document.getElementById("tablature-display").appendChild(img);
					});
				});
			}
		})
	});
});

