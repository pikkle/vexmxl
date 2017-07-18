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
    var MEASURE_LENGTH = 400;
    var Tablature = (function () {
        function Tablature(title, time, bpm, displayTablature, displayStave, _scale) {
            if (displayTablature === void 0) { displayTablature = true; }
            if (displayStave === void 0) { displayStave = true; }
            if (_scale === void 0) { _scale = 1.0; }
            this.title = title;
            this.time = time;
            this.bpm = bpm;
            this.displayTablature = displayTablature;
            this.displayStave = displayStave;
            this._scale = _scale;
            this.measures = [];
        }
        Tablature.prototype.getTitle = function () {
            return this.title;
        };
        Tablature.prototype.getBPM = function () {
            return this.bpm;
        };
        Tablature.prototype.getTimeSignature = function () {
            return this.time;
        };
        Tablature.prototype.addMeasure = function (measure) {
            this.measures.push(measure);
        };
        Tablature.prototype.getMeasures = function () {
            return this.measures;
        };
        Tablature.prototype.scale = function (ratio) {
            this._scale = ratio;
        };
        Tablature.prototype.width = function () {
            return MEASURE_LENGTH * this.measures.length;
        };
        Tablature.prototype.getMeasureLengths = function () {
            return this.measures.map(function (m) { return m.sumOfTimes(); });
        };
        Tablature.prototype.toString = function () {
            var _this = this;
            this.measures.map(function (m) {
                if (m.sumOfTimes() != _this.time.getBeatType())
                    console.warn("Measure does not fulfill the time signature !");
            });
            return "options width=" + this.width() + " scale=" + this._scale + "\n" +
                ("tabstave notation=" + this.displayStave + " tablature=" + this.displayTablature + "\n time=" + this.time + "\n") +
                this.measures.join("|\n");
        };
        return Tablature;
    }());
    exports.Tablature = Tablature;
    var TimeSignature = (function () {
        function TimeSignature(beats, beatType) {
            this.beats = beats;
            this.beatType = beatType;
        }
        TimeSignature.prototype.getBeats = function () {
            return this.beats;
        };
        TimeSignature.prototype.getBeatType = function () {
            return this.beatType;
        };
        TimeSignature.prototype.toString = function () {
            return this.beats + "/" + this.beatType;
        };
        return TimeSignature;
    }());
    exports.TimeSignature = TimeSignature;
    var Measure = (function () {
        function Measure() {
            this.times = [];
        }
        Measure.prototype.addTime = function (time) {
            this.times.push(time);
        };
        Measure.prototype.getTimes = function () {
            return this.times;
        };
        Measure.prototype.sumOfTimes = function () {
            return this.times
                .map(function (t) { return t.getDuration().value(); })
                .reduce(function (sum, current) { return sum + current; });
        };
        Measure.prototype.toString = function () {
            return "  notes " + this.times.join(" ");
        };
        Measure.prototype.notEmpty = function () {
            return this.times.length > 0;
        };
        return Measure;
    }());
    exports.Measure = Measure;
    var Duration = (function () {
        function Duration(musicxml, vextab, val) {
            this.musicxml = musicxml;
            this.vextab = vextab;
            this.val = val;
        }
        Duration.prototype.value = function () {
            return this.val;
        };
        Duration.prototype.toString = function () {
            return this.vextab.toString();
        };
        Duration.WHOLE = new Duration("whole", "w", 4);
        Duration.HALF_DOT = new Duration(undefined, "hd", 2 + 1);
        Duration.HALF = new Duration("half", "h", 2);
        Duration.QUARTER_DOT = new Duration(undefined, "qd", 1 + 1 / 2);
        Duration.QUARTER = new Duration("quarter", "q", 1);
        Duration.EIGHTH_DOT = new Duration(undefined, "8d", 1 / 2 + 1 / 4);
        Duration.EIGHTH = new Duration("eighth", "8", 1 / 2);
        Duration.T16_DOT = new Duration(undefined, "16d", 1 / 4 + 1 / 8);
        Duration.T16 = new Duration("16th", "16", 1 / 4);
        Duration.T32_DOT = new Duration(undefined, "32d", 1 / 8 + 1 / 16);
        Duration.T32 = new Duration("32nd", "32", 1 / 8);
        Duration.T64_DOT = new Duration(undefined, "64d", 1 / 16 + 1 / 32);
        Duration.T64 = new Duration("64th", "64", 1 / 16);
        Duration.T128_DOT = new Duration(undefined, "128d", 1 / 32 + 1 / 64);
        Duration.T128 = new Duration("128th", "128", 1 / 32);
        return Duration;
    }());
    exports.Duration = Duration;
    var Time = (function () {
        function Time(duration) {
            this.duration = duration;
        }
        Time.prototype.toString = function () {
            return ":" + this.duration + this.representation();
        };
        Time.prototype.getDuration = function () {
            return this.duration;
        };
        Time.prototype.setDuration = function (duration) {
            this.duration = duration;
        };
        return Time;
    }());
    exports.Time = Time;
    var Chord = (function (_super) {
        __extends(Chord, _super);
        function Chord() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.notes = [];
            return _this;
        }
        Chord.prototype.sortNotes = function () {
            this.notes.sort(function (a, b) {
                return b.getString() - a.getString();
            });
        };
        Chord.prototype.addNote = function (note) {
            if (this.hasNote(note.getString())) {
                throw new Error("A chord can only have one note on the same string");
            }
            else
                this.notes.push(note);
        };
        Chord.prototype.hasNote = function (string) {
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                var note = _a[_i];
                if (note.getString() === string)
                    return true;
            }
            return false;
        };
        Chord.prototype.getNotes = function () {
            return this.notes;
        };
        Chord.prototype.notEmpty = function () {
            return this.notes.length > 0;
        };
        Chord.prototype.representation = function () {
            this.sortNotes();
            return "(" + this.notes.join(".") + ")";
        };
        Chord.prototype.adaptPitch = function (modifier) {
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                var note = _a[_i];
                note.pitch(modifier);
            }
        };
        Chord.prototype.isChord = function () {
            return true;
        };
        return Chord;
    }(Time));
    exports.Chord = Chord;
    var Rest = (function (_super) {
        __extends(Rest, _super);
        function Rest() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Rest.prototype.representation = function () {
            return "##";
        };
        Rest.prototype.adaptPitch = function (modifier) {
            // Do nothing
        };
        Rest.prototype.isChord = function () {
            return false;
        };
        return Rest;
    }(Time));
    exports.Rest = Rest;
    var Note = (function () {
        function Note(fret, str) {
            this.fret = fret;
            this.str = str;
            if (str <= 0 || str > 6) {
                throw new Error("A string is in the bounds [1, 6]");
            }
            else if (fret < 0 || fret > 24) {
                throw new Error("A fret is in the bounds [0, 24]");
            }
            this._pitch = 0;
            this._bend = 0;
        }
        Note.prototype.toString = function () {
            var b = '';
            if (this._bend > 0) {
                b = "b" + (this.fret + this._pitch + this._bend);
            }
            return "" + (this.fret + this._pitch) + b + "/" + this.str;
        };
        Note.prototype.getFret = function () {
            return this.fret;
        };
        Note.prototype.getString = function () {
            return this.str;
        };
        Note.prototype.pitch = function (modifier) {
            this._pitch = modifier;
        };
        Note.prototype.bend = function (amount) {
            if (amount > 0) {
                this._bend = amount;
            }
            else {
                throw new Error("A bend must be strictly positive");
            }
        };
        Note.prototype.hasBend = function () {
            return this._bend > 0;
        };
        return Note;
    }());
    exports.Note = Note;
});
//# sourceMappingURL=vexmxl.tab.js.map