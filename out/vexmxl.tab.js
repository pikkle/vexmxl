define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MEASURE_LENGTH = 400;
    let vextab = new Artist(0, 0, 1);
    /**
     * Top class that represents the whole tablature.
     */
    class Tablature {
        constructor(title, time, bpm, displayTablature = true, displayStave = true, scale = 1.0) {
            this.title = title;
            this.time = time;
            this.bpm = bpm;
            this.displayTablature = displayTablature;
            this.displayStave = displayStave;
            this.scale = scale;
            this.measures = [];
        }
        getTitle() {
            return this.title;
        }
        getBPM() {
            return this.bpm;
        }
        getTimeSignature() {
            return this.time;
        }
        addMeasure(measure) {
            this.measures.push(measure);
        }
        getMeasures() {
            return this.measures;
        }
        setScale(ratio) {
            this.scale = ratio;
        }
        width() {
            return MEASURE_LENGTH * this.measures.length;
        }
        getMeasureLengths() {
            return this.measures.map(m => m.sumOfTimes());
        }
        toVextab() {
            this.measures.map(m => {
                if (m.sumOfTimes() != this.time.getBeatType())
                    console.warn("Measure does not fulfill the time signature !");
            });
            return `options width=${this.width()} scale=${this.scale}\n` +
                `tabstave notation=${this.displayStave} tablature=${this.displayTablature}\n time=${this.time}\n` +
                this.measures.map(m => m.toVextab()).join("|\n");
        }
    }
    exports.Tablature = Tablature;
    /**
     * Infos on the tempo of the song
     */
    class TimeSignature {
        /**
         * @param {number} beats the numerator on the music sheet
         * @param {number} beatType the denominator on the music sheet
         */
        constructor(beats, beatType) {
            this.beats = beats;
            this.beatType = beatType;
        }
        getBeats() {
            return this.beats;
        }
        getBeatType() {
            return this.beatType;
        }
        toVextab() {
            return `${this.beats}/${this.beatType}`;
        }
    }
    exports.TimeSignature = TimeSignature;
    /**
     * A measure contains a certain amount of times.
     * This amount is determined by the time signature.
     */
    class Measure {
        constructor() {
            this.times = [];
        }
        addTime(time) {
            this.times.push(time);
        }
        getTimes() {
            return this.times;
        }
        /**
         * Calculates the cumulated duration of contained times
         * @returns {number}
         */
        sumOfTimes() {
            return this.times
                .map(t => t.getDuration().value())
                .reduce((sum, current) => sum + current);
        }
        toVextab() {
            return "  notes " + this.times.map(t => t.toVextab()).join(" ");
        }
        notEmpty() {
            return this.times.length > 0;
        }
    }
    exports.Measure = Measure;
    /**
     * A musical duration
     */
    class Duration {
        constructor(musicxml, vextab, val) {
            this.musicxml = musicxml;
            this.vextab = vextab;
            this.val = val;
        }
        value() {
            return this.val;
        }
        toVextab() {
            return this.vextab.toString();
        }
        /**
         * Finds a Vexmxl duration based on the Vextab notation
         * @param vt The vextab notation ("w", "h", "q", "8", etc.)
         * @returns {undefined|Duration}
         */
        static fromVextab(vt) {
            return Duration.list.filter((value, index, obj) => value.vextab === vt)[0];
        }
    }
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
    Duration.list = [
        Duration.WHOLE, Duration.HALF_DOT, Duration.HALF, Duration.QUARTER_DOT, Duration.QUARTER,
        Duration.EIGHTH_DOT, Duration.EIGHTH, Duration.T16_DOT, Duration.T16, Duration.T32_DOT,
        Duration.T32, Duration.T64_DOT, Duration.T64, Duration.T128_DOT, Duration.T128
    ];
    exports.Duration = Duration;
    /**
     * A time is a music item (either a silence, a note, or a chord)
     */
    class Time {
        constructor(duration) {
            this.duration = duration;
        }
        toVextab() {
            return `:${this.duration}${this.representation()}`;
        }
        getDuration() {
            return this.duration;
        }
        setDuration(duration) {
            this.duration = duration;
        }
    }
    exports.Time = Time;
    /**
     * A chord is a set of notes.
     */
    class Chord extends Time {
        constructor() {
            super(...arguments);
            this.notes = [];
        }
        /**
         * Vextab needs the notes to be sorted on strings for correct displaying
         */
        sortNotes() {
            this.notes.sort((a, b) => {
                return b.getString() - a.getString();
            });
        }
        addNote(note) {
            if (this.hasNote(note.getString())) {
                throw new Error("A chord can only have one note on the same string");
            }
            else
                this.notes.push(note);
        }
        hasNote(string) {
            for (let note of this.notes) {
                if (note.getString() === string)
                    return true;
            }
            return false;
        }
        getNotes() {
            return this.notes;
        }
        notEmpty() {
            return this.notes.length > 0;
        }
        representation() {
            this.sortNotes();
            return `(${this.notes.map(n => n.toVextab()).join(".")})`;
        }
        adaptPitch(modifier) {
            for (let note of this.notes) {
                note.setPitch(modifier);
            }
        }
        isChord() {
            return true;
        }
    }
    exports.Chord = Chord;
    /**
     * A rest is a time silenced
     */
    class Rest extends Time {
        representation() {
            return "##";
        }
        adaptPitch(modifier) {
            // Do nothing
        }
        isChord() {
            return false;
        }
    }
    exports.Rest = Rest;
    /**
     * A note corresponds to a string pinched to a certain fret
     */
    class Note {
        constructor(fret, str) {
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
        toVextab() {
            let b = '';
            if (this._bend > 0) {
                b = `b${this.fret + this._bend}`;
            }
            return `${(this.fret)}${b}/${this.str}`;
        }
        getFret() {
            return this.fret;
        }
        getString() {
            return this.str;
        }
        setPitch(modifier) {
            this._pitch = modifier;
        }
        getPitch() {
            return this._pitch;
        }
        bend(amount) {
            if (amount > 0) {
                this._bend = amount;
            }
            else {
                throw new Error("A bend must be strictly positive");
            }
        }
        hasBend() {
            return this._bend > 0;
        }
        /**
         * Gives if the note is a sharp/bemol note
         * @returns {boolean}
         */
        hasSharp() {
            let wrap = vextab.getNoteForFret(this.fret, this.str);
            let note = wrap[0];
            return note.indexOf("#") > 0;
        }
    }
    exports.Note = Note;
});
