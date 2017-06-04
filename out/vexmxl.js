"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var musicxml_interfaces_1 = require("musicxml-interfaces");
var Renderer = Vex.Flow.Renderer;
var vexmxl_tab_1 = require("./vexmxl.tab");
var ParseError = (function (_super) {
    __extends(ParseError, _super);
    function ParseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ParseError;
}(Error));
var qd = 5 + 1 / 3;
var timeMap = {
    1: "w",
    2: "h",
    3: "hd",
    4: "q",
    8: "8",
    12: "8d",
    16: "16",
    24: "16d",
    32: "32",
};
timeMap[qd] = "qd";
var VexMxl;
(function (VexMxl) {
    function displayTablature(tab, div) {
        var artist = new Artist(10, 10, 600, { scale: 0.8 });
        var vt = new VexTab(artist);
        var renderer = new Renderer(div, 3 /* SVG */);
        var parsed = vexmxl_tab_1.VexMxlTab.toString();
        try {
            vt.parse(parsed);
            artist.render(renderer);
        }
        catch (e) {
            console.error(e);
        }
    }
    VexMxl.displayTablature = displayTablature;
    function parseXML(path) {
        return fetch(path)
            .then(function (response) {
            return response.text();
        })
            .then(function (score) {
            var doc = musicxml_interfaces_1.parseScore(score);
            console.debug("Converted XML to ", doc);
            var partName = doc.partList[0].id; // TODO: let the part choice to the user
            // let timeSignature: TimeSignature = new TimeSignature(doc.measures[0].parts[partName][1].divisions);
            var bpm = doc.measures[0].parts[partName][1].directionTypes[0].metronome.perMinute.data;
            var divisions = 1; // Number of notes in measure
            var tab = new vexmxl_tab_1.VexMxlTab.VexmxlTablature();
            for (var _i = 0, _a = doc.measures; _i < _a.length; _i++) {
                var docMeasure = _a[_i];
                var measure = new vexmxl_tab_1.VexMxlTab.VexmxlMeasure();
                var chord = void 0;
                for (var _b = 0, _c = docMeasure.parts[partName]; _b < _c.length; _b++) {
                    var elem = _c[_b];
                    if (elem._class === "Attributes") {
                        var attributes = elem;
                        if (attributes.divisions) {
                            divisions = attributes.divisions;
                        }
                    }
                    else if (elem._class === "Note") {
                        var note = elem;
                        var duration = timeMap[1 / (note.duration / (divisions * 4))];
                        if (note.rest) {
                            if (chord && chord.notEmpty()) {
                                measure.addTime(chord);
                                chord = undefined;
                            }
                            measure.addTime(new vexmxl_tab_1.VexMxlTab.VexmxlRest(duration));
                        }
                        else if (note.pitch) {
                            var tech = note.notations[0].technicals[0];
                            if (note.chord) {
                                if (!chord)
                                    throw new ParseError("Chord element has not been initialized properly");
                            }
                            else {
                                if (chord && chord.notEmpty()) {
                                    measure.addTime(chord);
                                }
                                chord = new vexmxl_tab_1.VexMxlTab.VexmxlChord(duration);
                            }
                            chord.addNote(new vexmxl_tab_1.VexMxlTab.VexmxlNote(tech.fret.fret, tech.string.stringNum));
                        }
                        else {
                            throw new ParseError("note has not been recognized");
                        }
                    }
                }
                if (chord && chord.notEmpty()) {
                    measure.addTime(chord);
                }
                if (measure.notEmpty()) {
                    tab.addMeasure(measure);
                }
            }
            return tab;
        });
    }
    VexMxl.parseXML = parseXML;
})(VexMxl = exports.VexMxl || (exports.VexMxl = {}));
//# sourceMappingURL=vexmxl.js.map