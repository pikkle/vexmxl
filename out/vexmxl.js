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
define(["require", "exports", "musicxml-interfaces", "./vexmxl.tab", "vexflow"], function (require, exports, musicxml_interfaces_1, vexmxl_tab_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VexmxlDuration = vexmxl_tab_1.VexMxlTab.VexmxlDuration;
    var Renderer = Vex.Flow.Renderer;
    var ParseError = (function (_super) {
        __extends(ParseError, _super);
        function ParseError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ParseError;
    }(Error));
    var timeMap = {
        4: VexmxlDuration.WHOLE,
        3: VexmxlDuration.HALF_DOT,
        2: VexmxlDuration.HALF,
        1.5: VexmxlDuration.QUARTER_DOT,
        1: VexmxlDuration.QUARTER,
        0.75: VexmxlDuration.EIGHTH_DOT,
        0.5: VexmxlDuration.EIGHTH,
        0.375: VexmxlDuration.T16_DOT,
        0.25: VexmxlDuration.T16,
        0.1875: VexmxlDuration.T32_DOT,
        0.125: VexmxlDuration.T32,
        0.09375: VexmxlDuration.T64_DOT,
        0.0625: VexmxlDuration.T64
    };
    var VexMxl;
    (function (VexMxl) {
        var VexmxlTimeSignature = vexmxl_tab_1.VexMxlTab.VexmxlTimeSignature;
        function displayTablature(tab, div, canvas) {
            var artist = new Artist(0, 0, tab.width());
            var vt = new VexTab(artist);
            var renderer = new Renderer(div, canvas ? 1 /* CANVAS */ : 3 /* SVG */);
            var parsed = tab.toString();
            try {
                vt.parse(parsed);
                console.log(vt);
                artist.render(renderer);
            }
            catch (e) {
                console.error(e);
            }
        }
        function generateSVG(tab) {
            var div = document.createElement("div");
            displayTablature(tab, div, false);
            return div.children[0];
        }
        VexMxl.generateSVG = generateSVG;
        function generateCanvas(tab) {
            var canvas = document.createElement("canvas");
            displayTablature(tab, canvas, true);
            return canvas;
        }
        VexMxl.generateCanvas = generateCanvas;
        function generateImage(tab) {
            var svg = generateSVG(tab);
            var svgData = new XMLSerializer().serializeToString(svg);
            var data = "data:image/svg+xml;base64," + btoa(svgData);
            var img = document.createElement("img");
            img.setAttribute('src', data);
            return img;
        }
        VexMxl.generateImage = generateImage;
        function parseXML(path, displayTab, displayStave) {
            if (displayTab === void 0) { displayTab = true; }
            if (displayStave === void 0) { displayStave = true; }
            return fetch(path)
                .then(function (response) {
                return response.text();
            })
                .then(function (score) {
                var doc = musicxml_interfaces_1.parseScore(score);
                console.debug(doc);
                var partName = doc.partList[0].id; // TODO: let the part choice to the user
                var metronome = doc.measures[0].parts[partName][1].directionTypes[0].metronome;
                var times = doc.measures[0].parts[partName][0].times[0];
                var bpm = +metronome.perMinute.data;
                var title = doc.movementTitle;
                var time = new VexmxlTimeSignature(+times.beats[0], times.beatTypes[0]);
                var divisions = 1; // Number of notes in measure
                var tab = new vexmxl_tab_1.VexMxlTab.VexmxlTablature(title, time, bpm, displayTab, displayStave);
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
                            var duration = timeMap[1 / divisions * note.duration];
                            if (note.rest) {
                                if (chord && chord.notEmpty()) {
                                    measure.addTime(chord);
                                    chord = undefined; // for next note
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
                                var vNote = new vexmxl_tab_1.VexMxlTab.VexmxlNote(tech.fret.fret, tech.string.stringNum);
                                if (tech.bend) {
                                    vNote.bend(+tech.bend.bendAlter);
                                }
                                chord.addNote(vNote);
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
});
//# sourceMappingURL=vexmxl.js.map