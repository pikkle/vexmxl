

import {VexMxl} from "../src/vexmxl";

console.log("woot");

VexMxl.parseXML("../support/Back In Black.xml").then(tab => {
	console.log(tab);
	let img = VexMxl.generateSVG(tab);
	document.getElementById("display").appendChild(img);
});