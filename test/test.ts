import {generateImage, parseXMLFromFile} from "../src/vexmxl";

parseXMLFromFile("support/BackInBlack.xml").then(tab => {
	console.log(tab.toVextab());
	let image = generateImage(tab).img;
	document.getElementById("display").appendChild(image);
});