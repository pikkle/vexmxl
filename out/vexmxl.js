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
define(["require", "exports", "musicxml-interfaces", "./vexmxl.tab"], function (require, exports, musicxml_interfaces_1, vexmxl_tab_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Renderer = Vex.Flow.Renderer;
    var VexmxlDuration = vexmxl_tab_1.VexMxlTab.VexmxlDuration;
    var ParseError = (function (_super) {
        __extends(ParseError, _super);
        function ParseError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ParseError;
    }(Error));
    var qd = 5 + 1 / 3;
    var timeMap = {
        1: VexmxlDuration.WHOLE,
        2: VexmxlDuration.HALF,
        3: VexmxlDuration.HALF_DOT,
        4: VexmxlDuration.QUARTER,
        8: VexmxlDuration.EIGHTH,
        12: VexmxlDuration.EIGHTH_DOT,
        16: VexmxlDuration.SIXTEENTH,
        24: VexmxlDuration.SIXTEENTH_DOT,
        32: VexmxlDuration.THIRTYSECOND,
    };
    timeMap[qd] = VexmxlDuration.QUARTER_DOT;
    var VexMxl;
    (function (VexMxl) {
        function displayTablature(tab, div, canvas) {
            var artist = new Artist(10, 10, 600, { scale: 0.8 });
            artist.NOLOGO = true;
            var vt = new VexTab(artist);
            var renderer = new Renderer(div, canvas ? 1 /* CANVAS */ : 3 /* SVG */);
            var parsed = tab.toString();
            try {
                vt.parse(parsed);
                artist.render(renderer);
            }
            catch (e) {
                console.error(e);
            }
        }
        function generateSVG(tab) {
            var div = document.createElement("div");
            displayTablature(tab, div, false);
            return div;
        }
        VexMxl.generateSVG = generateSVG;
        function generateCanvas(tab) {
            var canvas = document.createElement("canvas");
            displayTablature(tab, canvas, true);
            return canvas;
        }
        VexMxl.generateCanvas = generateCanvas;
        function generateImage(tab) {
            var display = generateSVG(tab);
            var svg = display.children[0];
            var svgData = new XMLSerializer().serializeToString(svg);
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var img = document.createElement("img");
            img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                console.log(canvas.toDataURL("image/png"));
            };
            return img;
        }
        VexMxl.generateImage = generateImage;
        function parseXML(path, debug) {
            if (debug === void 0) { debug = false; }
            return fetch(path)
                .then(function (response) {
                return response.text();
            })
                .then(function (score) {
                var doc = musicxml_interfaces_1.parseScore(score);
                if (debug)
                    console.debug(doc);
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
});
//# sourceMappingURL=vexmxl.js.map