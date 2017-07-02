import * as registerSuite from "intern!object";
import * as assert from "intern/chai!assert";
import {VexMxlTab} from "../../vexmxl.tab";
import {VexMxl} from "../../vexmxl";
import VexmxlTimeSignature = VexMxlTab.VexmxlTimeSignature;

registerSuite({
	"name": "vexmxl parse and display functions",

	"test display": () => {
		let tab = new VexMxlTab.VexmxlTablature("", new VexmxlTimeSignature(4, 4));
		VexMxl.generateSVG(tab);
		assert.equal(true, true);
	},

});
