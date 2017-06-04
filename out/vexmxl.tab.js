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
        VexmxlTablature.prototype.toString = function () {
            var width = MEASURE_LENGTH * this.measures.length;
            var options = "options width=" + width + " scale=" + this.scale;
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
        VexmxlMeasure.prototype.toString = function () {
            return "  notes " + this.times.join(" ");
        };
        VexmxlMeasure.prototype.notEmpty = function () {
            return this.times.length > 0;
        };
        return VexmxlMeasure;
    }());
    VexMxlTab.VexmxlMeasure = VexmxlMeasure;
    var VexmxlTime = (function () {
        function VexmxlTime(duration) {
            this.duration = duration;
        }
        VexmxlTime.prototype.toString = function () {
            return ":" + this.duration + " " + this.representation();
        };
        VexmxlTime.prototype.setDuration = function (duration) {
            this.duration = duration;
        };
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
            this.notes.push(note);
        };
        VexmxlChord.prototype.notEmpty = function () {
            return this.notes.length > 0;
        };
        VexmxlChord.prototype.representation = function () {
            return "(" + this.notes.join(".") + ")";
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
        }
        VexmxlNote.prototype.toString = function () {
            return this.fret + "/" + this.str;
        };
        return VexmxlNote;
    }());
    VexMxlTab.VexmxlNote = VexmxlNote;
})(VexMxlTab = exports.VexMxlTab || (exports.VexMxlTab = {}));
//# sourceMappingURL=vexmxl.tab.js.map