import {VexMxl} from "../src/vexmxl";


VexMxl.parseXML("../support/Back In Black2.xml", true, true).then(tab => {
	console.log(tab.getMeasureLengths());
	console.log(tab);
	console.log(tab.toString());
	let img = VexMxl.generateImage(tab);
	document.getElementById("display").appendChild(img);
});