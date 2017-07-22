define(["require", "exports", "musicxml-interfaces", "./vexmxl.tab", "vexflow"], function (require, exports, mxl, vexmxl_tab_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Renderer = Vex.Flow.Renderer;
    class ParseError extends Error {
    }
    let timeMap = {
        4: vexmxl_tab_1.Duration.WHOLE,
        3: vexmxl_tab_1.Duration.HALF_DOT,
        2: vexmxl_tab_1.Duration.HALF,
        1.5: vexmxl_tab_1.Duration.QUARTER_DOT,
        1: vexmxl_tab_1.Duration.QUARTER,
        0.75: vexmxl_tab_1.Duration.EIGHTH_DOT,
        0.5: vexmxl_tab_1.Duration.EIGHTH,
        0.375: vexmxl_tab_1.Duration.T16_DOT,
        0.25: vexmxl_tab_1.Duration.T16,
        0.1875: vexmxl_tab_1.Duration.T32_DOT,
        0.125: vexmxl_tab_1.Duration.T32,
        0.09375: vexmxl_tab_1.Duration.T64_DOT,
        0.0625: vexmxl_tab_1.Duration.T64
    };
    function displayTablature(tab, div, canvas) {
        let artist = new Artist(0, 0, tab.width());
        let vt = new VexTab(artist);
        let renderer = new Renderer(div, canvas ? 1 /* CANVAS */ : 3 /* SVG */);
        let parsed = tab.toString();
        try {
            vt.parse(parsed);
            console.debug(vt);
            artist.render(renderer);
            console.debug(artist);
        }
        catch (e) {
            console.error(e);
        }
        return vt;
    }
    function generateSVG(tab) {
        let div = document.createElement("div");
        displayTablature(tab, div, false);
        return div.children[0];
    }
    exports.generateSVG = generateSVG;
    function generateCanvas(tab) {
        let canvas = document.createElement("canvas");
        console.warn("Canvas size is limited, e.g. Chrome's canvas can only be 32,767x32,767 pixels. " +
            "If it exceeds, nothing will be displayed.");
        displayTablature(tab, canvas, true);
        return canvas;
    }
    exports.generateCanvas = generateCanvas;
    function generateImage(tab) {
        let svg = generateSVG(tab); // uses SVG rendering instead of canvas because of size limitations
        let svgData = new XMLSerializer().serializeToString(svg);
        let data = "data:image/svg+xml;base64," + btoa(svgData);
        let img = document.createElement("img");
        img.setAttribute('src', data);
        return img;
    }
    exports.generateImage = generateImage;
    function parseXML(xml, displayTab, displayStave) {
        return Promise.resolve(xml).then((score) => {
            let doc = mxl.parseScore(score);
            console.debug(doc);
            let partName = doc.partList[0].id; // TODO: let the part choice to the user
            let times;
            let metronome;
            for (let obj of doc.measures[0].parts[partName]) {
                if (obj.hasOwnProperty("directionTypes")) {
                    metronome = obj.directionTypes[0].metronome;
                }
                if (obj.hasOwnProperty("times")) {
                    times = obj.times[0];
                }
            }
            let bpm = +metronome.perMinute.data;
            let title = doc.movementTitle;
            let time = new vexmxl_tab_1.TimeSignature(+times.beats[0], times.beatTypes[0]);
            let divisions = 1; // Number of notes in measure
            let tab = new vexmxl_tab_1.Tablature(title, time, bpm, displayTab, displayStave);
            for (let docMeasure of doc.measures) {
                let measure = new vexmxl_tab_1.Measure();
                let chord;
                for (let elem of docMeasure.parts[partName]) {
                    if (elem._class === "Attributes") {
                        let attributes = elem;
                        if (attributes.divisions) {
                            divisions = attributes.divisions;
                        }
                    }
                    else if (elem._class === "Note") {
                        let note = elem;
                        let duration = timeMap[1 / divisions * note.duration];
                        if (note.rest) {
                            if (chord && chord.notEmpty()) {
                                measure.addTime(chord);
                                chord = undefined; // for next note
                            }
                            measure.addTime(new vexmxl_tab_1.Rest(duration));
                        }
                        else if (note.pitch) {
                            let tech = note.notations[0].technicals[0];
                            if (note.chord) {
                                if (!chord)
                                    throw new ParseError("Chord element has not been initialized properly");
                            }
                            else {
                                if (chord && chord.notEmpty()) {
                                    measure.addTime(chord);
                                }
                                chord = new vexmxl_tab_1.Chord(duration);
                            }
                            let vNote = new vexmxl_tab_1.Note(tech.fret.fret, tech.string.stringNum);
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
    function parseXMLFromString(xml, displayTab = true, displayStave = true) {
        return Promise.resolve(xml).then(str => {
            return parseXML(str, displayTab, displayStave);
        });
    }
    exports.parseXMLFromString = parseXMLFromString;
    function parseXMLFromFile(path, displayTab = true, displayStave = true) {
        return fetch(path).then((response) => {
            return response.text();
        }).then(str => {
            return parseXML(str, displayTab, displayStave);
        });
    }
    exports.parseXMLFromFile = parseXMLFromFile;
});
