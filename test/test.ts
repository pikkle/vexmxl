import {VexMxl} from "../src/vexmxl";
import "vexflow";
import {} from "../src/vextab";
import Renderer = Vex.Flow.Renderer;

VexMxl.parseXML("../support/Back In Black2.xml", true, true).then(tab => {
	console.log(tab);
	console.log(tab.toString());
	let img = VexMxl.generateSVG(tab);
	document.getElementById("display").appendChild(img);
});

