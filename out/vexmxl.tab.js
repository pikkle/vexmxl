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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VexMxlTab;
    (function (VexMxlTab) {
        var MEASURE_LENGTH = 400;
        var VexmxlTablature = (function () {
            function VexmxlTablature(displaySheet, scale) {
                if (displaySheet === void 0) { displaySheet = true; }
                if (scale === void 0) { scale = 1.0; }
                this.displaySheet = displaySheet;
                this.scale = scale;
                this.measures = [];
            }
            VexmxlTablature.prototype.addMeasure = function (measure) {
                this.measures.push(measure);
            };
            VexmxlTablature.prototype.getMeasures = function () {
                return this.measures;
            };
            VexmxlTablature.prototype.displayMusicSheet = function (b) {
                this.displaySheet = b;
            };
            VexmxlTablature.prototype.displayScale = function (ratio) {
                this.scale = ratio;
            };
            VexmxlTablature.prototype.width = function () {
                return MEASURE_LENGTH * this.measures.length;
            };
            VexmxlTablature.prototype.toString = function () {
                var options = "options width=" + this.width() + " scale=" + this.scale;
                return options + "\ntabstave notation= " + this.displaySheet + "\n" + this.measures.join("|\n");
            };
            return VexmxlTablature;
        }());
        VexMxlTab.VexmxlTablature = VexmxlTablature;
        var VexmxlMeasure = (function () {
            function VexmxlMeasure() {
                this.times = [];
            }
            VexmxlMeasure.prototype.addTime = function (time) {
                this.times.push(time);
            };
            VexmxlMeasure.prototype.getTimes = function () {
                return this.times;
            };
            VexmxlMeasure.prototype.toString = function () {
                return "  notes " + this.times.join(" ");
            };
            VexmxlMeasure.prototype.notEmpty = function () {
                return this.times.length > 0;
            };
            return VexmxlMeasure;
        }());
        VexMxlTab.VexmxlMeasure = VexmxlMeasure;
        var VexmxlDuration = (function () {
            function VexmxlDuration(representation) {
                this.representation = representation;
            }
            VexmxlDuration.prototype.toString = function () {
                return this.representation;
            };
            return VexmxlDuration;
        }());
        VexmxlDuration.WHOLE = new VexmxlDuration("w");
        VexmxlDuration.HALF = new VexmxlDuration("h");
        VexmxlDuration.HALF_DOT = new VexmxlDuration("hd");
        VexmxlDuration.QUARTER = new VexmxlDuration("q");
        VexmxlDuration.QUARTER_DOT = new VexmxlDuration("qd");
        VexmxlDuration.EIGHTH = new VexmxlDuration("8");
        VexmxlDuration.EIGHTH_DOT = new VexmxlDuration("8d");
        VexmxlDuration.SIXTEENTH = new VexmxlDuration("16");
        VexmxlDuration.SIXTEENTH_DOT = new VexmxlDuration("16d");
        VexmxlDuration.THIRTYSECOND = new VexmxlDuration("32");
        VexMxlTab.VexmxlDuration = VexmxlDuration;
        var VexmxlTime = (function () {
            function VexmxlTime(duration) {
                this.duration = duration;
            }
            VexmxlTime.prototype.toString = function () {
                return ":" + this.duration + " " + this.representation();
            };
            VexmxlTime.prototype.getDuration = function () {
                return this.duration;
            };
            VexmxlTime.prototype.setDuration = function (duration) {
                this.duration = duration;
            };
            VexmxlTime.prototype.adaptPitch = function (modifier) { };
            ;
            return VexmxlTime;
        }());
        VexMxlTab.VexmxlTime = VexmxlTime;
        var VexmxlChord = (function (_super) {
            __extends(VexmxlChord, _super);
            function VexmxlChord() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.notes = [];
                return _this;
            }
            VexmxlChord.prototype.addNote = function (note) {
                if (this.hasNote(note.getString())) {
                    throw new Error("A chord can only have one note on the same string");
                }
                else
                    this.notes.push(note);
            };
            VexmxlChord.prototype.hasNote = function (string) {
                for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                    var note = _a[_i];
                    if (note.getString() === string)
                        return true;
                }
                return false;
            };
            VexmxlChord.prototype.getNotes = function () {
                return this.notes;
            };
            VexmxlChord.prototype.notEmpty = function () {
                return this.notes.length > 0;
            };
            VexmxlChord.prototype.representation = function () {
                return "(" + this.notes.join(".") + ")";
            };
            VexmxlChord.prototype.adaptPitch = function (modifier) {
                for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                    var note = _a[_i];
                    note.adaptPitch(modifier);
                }
            };
            return VexmxlChord;
        }(VexmxlTime));
        VexMxlTab.VexmxlChord = VexmxlChord;
        var VexmxlRest = (function (_super) {
            __extends(VexmxlRest, _super);
            function VexmxlRest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            VexmxlRest.prototype.representation = function () {
                return "##";
            };
            return VexmxlRest;
        }(VexmxlTime));
        VexMxlTab.VexmxlRest = VexmxlRest;
        var VexmxlNote = (function () {
            function VexmxlNote(fret, str) {
                this.fret = fret;
                this.str = str;
                if (str <= 0 || str > 6) {
                    throw new Error("A string is in the bounds [1, 6]");
                }
                else if (fret < 0 || fret > 24) {
                    throw new Error("A fret is in the bounds [0, 24]");
                }
                this.modifier = 0;
            }
            VexmxlNote.prototype.toString = function () {
                return (this.fret + this.modifier) + "/" + this.str;
            };
            VexmxlNote.prototype.getFret = function () {
                return this.fret;
            };
            VexmxlNote.prototype.getString = function () {
                return this.str;
            };
            VexmxlNote.prototype.adaptPitch = function (modifier) {
                this.modifier = modifier;
            };
            return VexmxlNote;
        }());
        VexMxlTab.VexmxlNote = VexmxlNote;
    })(VexMxlTab = exports.VexMxlTab || (exports.VexMxlTab = {}));
});
//# sourceMappingURL=vexmxl.tab.js.map