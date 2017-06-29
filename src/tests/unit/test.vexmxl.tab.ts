import * as registerSuite from "intern!object";
import * as assert from "intern/chai!assert";
import {VexMxlTab} from "../../vexmxl.tab";
import VexmxlChord = VexMxlTab.VexmxlChord;
import VexmxlDuration = VexMxlTab.VexmxlDuration;
import VexmxlNote = VexMxlTab.VexmxlNote;
import VexmxlRest = VexMxlTab.VexmxlRest;

registerSuite({
	"name": "vexmxl intern structure",

	"a chord should not have twice a note on the same string": () => {
		let chord = new VexmxlChord(VexmxlDuration.QUARTER);
		let note = new VexmxlNote(0, 1);
		chord.addNote(note);
		assert.throws(() => chord.addNote(note), Error)
	},

	"a note on a guitar cannot use virtual strings": () => {
		assert.throws(() => new VexmxlNote(0, 0), Error);
		assert.throws(() => new VexmxlNote(0, -10), Error);
		assert.throws(() => new VexmxlNote(0, 7), Error);
		assert.throws(() => new VexmxlNote(0, 10), Error);
		for (let i = 1; i <= 6; i++) {
			assert.doesNotThrow(() => new VexmxlNote(0, i), Error);
		}
	},

	"a note on a guitar cannot use virtual frets": () => {
		assert.throws(() => new VexmxlNote(-1, 1), Error);
		assert.throws(() => new VexmxlNote(-10, 1), Error);
		assert.throws(() => new VexmxlNote(25, 1), Error);
		assert.throws(() => new VexmxlNote(30, 1), Error);
		for (let i = 0; i <= 24; i++) {
			assert.doesNotThrow(() => new VexmxlNote(i, 1), Error);
		}
	},

	"a note should be displayed as fret/string": () => {
		assert.equal((new VexmxlNote(0, 1).toString()), "0/1");
		assert.equal((new VexmxlNote(1, 4).toString()), "1/4");
		assert.equal((new VexmxlNote(22, 3).toString()), "22/3");
	},

	"a rest should be displayed as :time ##": () => {
		assert.equal((new VexmxlRest(VexmxlDuration.QUARTER)).toString(), ":q ##");
		assert.equal((new VexmxlRest(VexmxlDuration.WHOLE)).toString(), ":w ##");
	}

});
