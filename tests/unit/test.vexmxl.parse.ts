import * as registerSuite from "intern!object";
import * as assert from "intern/chai!assert";
import {VexMxlTab} from "../../src/vexmxl.tab";
import {VexMxl} from "../../src/vexmxl";

registerSuite({
	"name": "vexmxl parse and display functions",

	"test display": () => {
		let tab = new VexMxlTab.VexmxlTablature(true);
		VexMxl.generateSVG(tab);
		assert.equal(true, true);
	},

});
