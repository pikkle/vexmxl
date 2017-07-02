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
            function VexmxlTablature(title, time, displayTablature, displayStave, scale) {
                if (displayTablature === void 0) { displayTablature = true; }
                if (displayStave === void 0) { displayStave = true; }
                if (scale === void 0) { scale = 1.0; }
                this.title = title;
                this.time = time;
                this.displayTablature = displayTablature;
                this.displayStave = displayStave;
                this.scale = scale;
                this.measures = [];
            }
            VexmxlTablature.prototype.getTitle = function () {
                return this.title;
            };
            VexmxlTablature.prototype.addMeasure = function (measure) {
                this.measures.push(measure);
            };
            VexmxlTablature.prototype.getMeasures = function () {
                return this.measures;
            };
            VexmxlTablature.prototype.displayScale = function (ratio) {
                this.scale = ratio;
            };
            VexmxlTablature.prototype.width = function () {
                return MEASURE_LENGTH * this.measures.length;
            };
            VexmxlTablature.prototype.getMeasureLengths = function () {
                return this.measures.map(function (m) { return m.sumOfTimes(); });
            };
            VexmxlTablature.prototype.toString = function () {
                var _this = this;
                this.measures.map(function (m) {
                    if (m.sumOfTimes() != _this.time.getBeatType())
                        console.warn("Measure does not fulfill the time signature !");
                });
                return "options width=" + this.width() + " scale=" + this.scale + "\n" +
                    ("tabstave notation=" + this.displayStave + " tablature=" + this.displayTablature + "\n time=" + this.time + "\n") +
                    this.measures.join("|\n");
            };
            return VexmxlTablature;
        }());
        VexMxlTab.VexmxlTablature = VexmxlTablature;
        var VexmxlTimeSignature = (function () {
            function VexmxlTimeSignature(beats, beatType) {
                this.beats = beats;
                this.beatType = beatType;
            }
            VexmxlTimeSignature.prototype.getBeats = function () {
                return this.beats;
            };
            VexmxlTimeSignature.prototype.getBeatType = function () {
                return this.beatType;
            };
            VexmxlTimeSignature.prototype.toString = function () {
                return this.beats + "/" + this.beatType;
            };
            return VexmxlTimeSignature;
        }());
        VexMxlTab.VexmxlTimeSignature = VexmxlTimeSignature;
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
            VexmxlMeasure.prototype.sumOfTimes = function () {
                return this.times
                    .map(function (t) { return t.getDuration().value(); })
                    .reduce(function (sum, current) { return sum + current; });
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
            function VexmxlDuration(musicxml, vextab, val) {
                this.musicxml = musicxml;
                this.vextab = vextab;
                this.val = val;
            }
            VexmxlDuration.fromMusicxml = function (musicxml) {
                return undefined;
            };
            VexmxlDuration.prototype.value = function () {
                return this.val;
            };
            VexmxlDuration.prototype.toString = function () {
                return this.vextab.toString();
            };
            VexmxlDuration.WHOLE = new VexmxlDuration("whole", "w", 4);
            VexmxlDuration.HALF_DOT = new VexmxlDuration(undefined, "hd", 2 + 1);
            VexmxlDuration.HALF = new VexmxlDuration("half", "h", 2);
            VexmxlDuration.QUARTER_DOT = new VexmxlDuration(undefined, "qd", 1 + 1 / 2);
            VexmxlDuration.QUARTER = new VexmxlDuration("quarter", "q", 1);
            VexmxlDuration.EIGHTH_DOT = new VexmxlDuration(undefined, "8d", 1 / 2 + 1 / 4);
            VexmxlDuration.EIGHTH = new VexmxlDuration("eighth", "8", 1 / 2);
            VexmxlDuration.T16_DOT = new VexmxlDuration(undefined, "16d", 1 / 4 + 1 / 8);
            VexmxlDuration.T16 = new VexmxlDuration("16th", "16", 1 / 4);
            VexmxlDuration.T32_DOT = new VexmxlDuration(undefined, "32d", 1 / 8 + 1 / 16);
            VexmxlDuration.T32 = new VexmxlDuration("32nd", "32", 1 / 8);
            VexmxlDuration.T64_DOT = new VexmxlDuration(undefined, "64d", 1 / 16 + 1 / 32);
            VexmxlDuration.T64 = new VexmxlDuration("64th", "64", 1 / 16);
            VexmxlDuration.T128_DOT = new VexmxlDuration(undefined, "128d", 1 / 32 + 1 / 64);
            VexmxlDuration.T128 = new VexmxlDuration("128th", "128", 1 / 32);
            return VexmxlDuration;
        }());
        VexMxlTab.VexmxlDuration = VexmxlDuration;
        var VexmxlTime = (function () {
            function VexmxlTime(duration) {
                this.duration = duration;
            }
            VexmxlTime.prototype.toString = function () {
                return ":" + this.duration + this.representation();
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
            VexmxlChord.prototype.sortNotes = function () {
                this.notes.sort(function (a, b) {
                    return b.getString() - a.getString();
                });
            };
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
                this.sortNotes();
                return "(" + this.notes.join(".") + ")";
            };
            VexmxlChord.prototype.adaptPitch = function (modifier) {
                for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                    var note = _a[_i];
                    note.pitch(modifier);
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
                this._pitch = 0;
            }
            VexmxlNote.prototype.toString = function () {
                var b = '';
                if (this._bend) {
                    b = "b" + (this.fret + this._pitch + this._bend);
                }
                return "" + (this.fret + this._pitch) + b + "/" + this.str;
            };
            VexmxlNote.prototype.getFret = function () {
                return this.fret;
            };
            VexmxlNote.prototype.getString = function () {
                return this.str;
            };
            VexmxlNote.prototype.pitch = function (modifier) {
                this._pitch = modifier;
            };
            VexmxlNote.prototype.bend = function (amount) {
                this._bend = amount;
            };
            return VexmxlNote;
        }());
        VexMxlTab.VexmxlNote = VexmxlNote;
    })(VexMxlTab = exports.VexMxlTab || (exports.VexMxlTab = {}));
});
//# sourceMappingURL=vexmxl.tab.js.map