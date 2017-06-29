import * as registerSuite from "intern!object";
import * as assert from "intern/chai!assert";
import {VexMxlTab} from "../../vexmxl.tab";
import {VexMxl} from "../../vexmxl";

registerSuite({
	"name": "vexmxl parse and display functions",

	"test display": () => {
		let tab = new VexMxlTab.VexmxlTablature("");
		VexMxl.generateSVG(tab);
		assert.equal(true, true);
	},

});
