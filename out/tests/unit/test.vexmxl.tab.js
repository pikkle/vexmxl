define(["require", "exports", "intern!object", "intern/chai!assert", "../../vexmxl.tab"], function (require, exports, registerSuite, assert, vexmxl_tab_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VexmxlChord = vexmxl_tab_1.VexMxlTab.VexmxlChord;
    var VexmxlDuration = vexmxl_tab_1.VexMxlTab.VexmxlDuration;
    var VexmxlNote = vexmxl_tab_1.VexMxlTab.VexmxlNote;
    var VexmxlRest = vexmxl_tab_1.VexMxlTab.VexmxlRest;
    registerSuite({
        "name": "vexmxl intern structure",
        "a chord should not have twice a note on the same string": function () {
            var chord = new VexmxlChord(VexmxlDuration.QUARTER);
            var note = new VexmxlNote(0, 1);
            chord.addNote(note);
            assert.throws(function () { return chord.addNote(note); }, Error);
        },
        "a note on a guitar cannot use virtual strings": function () {
            assert.throws(function () { return new VexmxlNote(0, 0); }, Error);
            assert.throws(function () { return new VexmxlNote(0, -10); }, Error);
            assert.throws(function () { return new VexmxlNote(0, 7); }, Error);
            assert.throws(function () { return new VexmxlNote(0, 10); }, Error);
            var _loop_1 = function (i) {
                assert.doesNotThrow(function () { return new VexmxlNote(0, i); }, Error);
            };
            for (var i = 1; i <= 6; i++) {
                _loop_1(i);
            }
        },
        "a note on a guitar cannot use virtual frets": function () {
            assert.throws(function () { return new VexmxlNote(-1, 1); }, Error);
            assert.throws(function () { return new VexmxlNote(-10, 1); }, Error);
            assert.throws(function () { return new VexmxlNote(25, 1); }, Error);
            assert.throws(function () { return new VexmxlNote(30, 1); }, Error);
            var _loop_2 = function (i) {
                assert.doesNotThrow(function () { return new VexmxlNote(i, 1); }, Error);
            };
            for (var i = 0; i <= 24; i++) {
                _loop_2(i);
            }
        },
        "a note should be displayed as fret/string": function () {
            assert.equal((new VexmxlNote(0, 1).toString()), "0/1");
            assert.equal((new VexmxlNote(1, 4).toString()), "1/4");
            assert.equal((new VexmxlNote(22, 3).toString()), "22/3");
        },
        "a rest should be displayed as :time ##": function () {
            assert.equal((new VexmxlRest(VexmxlDuration.QUARTER)).toString(), ":q ##");
            assert.equal((new VexmxlRest(VexmxlDuration.WHOLE)).toString(), ":w ##");
        }
    });
});
//# sourceMappingURL=test.vexmxl.tab.js.map