import "vexflow";
import {} from "../src/vextab";
import Renderer = Vex.Flow.Renderer;
import {generateImage, generateSVG, parseXMLFromFile, parseXMLFromString} from "../src/vexmxl";

parseXMLFromFile("../support/Back In Black2.xml", true, true).then(tab => {
	console.log(tab);
	console.log(tab.toString());
	let img = generateImage(tab);
	document.getElementById("display").appendChild(img);
});
