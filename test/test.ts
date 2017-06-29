

import {VexMxl} from "../src/vexmxl";

console.log("woot");

VexMxl.parseXML("../support/Back In Black.xml").then(tab => {
	console.log("Here");
	let img = VexMxl.generateSVG(tab);
	console.log("we");
	document.getElementById("display").appendChild(img);
	console.log("are");
});