define(["require", "exports", "musicxml-interfaces", "./vexmxl.tab", "vexflow"], function (require, exports, mxl, vexmxl_tab_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Renderer = Vex.Flow.Renderer;
    const timeMap = {
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
        0.0625: vexmxl_tab_1.Duration.T64 // T32 / 2
    };
    /**
     * Parses the vextab and renders a SVG or CANVAS engraving of the tablature
     * @param {Tablature} tab the tab to be parsed
     * @param {HTMLElement} div the dom element to be filled with the result
     * @param {boolean} canvas wether to use the canvas or not
     * @returns {VexTab} the VexTab object containing the result's infos
     */
    function displayTablature(tab, div, canvas) {
        let artist = new Artist(0, 0, tab.width());
        let vt = new VexTab(artist);
        let renderer = new Renderer(div, canvas ? 1 /* CANVAS */ : 3 /* SVG */);
        let parsed = tab.toString();
        try {
            vt.parse(parsed);
            artist.render(renderer);
        }
        catch (e) {
            console.error(e);
        }
        return vt;
    }
    /**
     * Generates an SVG element from a tablature element
     * @param {Tablature} tab
     * @returns {{svg: SVGElement; vt: VexTab}} the SVG element and the generated VexTab
     */
    function generateSVG(tab) {
        let div = document.createElement("div");
        let vt = displayTablature(tab, div, false);
        return { svg: div.children[0], vt: vt };
    }
    exports.generateSVG = generateSVG;
    /**
     * Generates a Canvas element from a tablature element
     * @param {Tablature} tab
     * @returns {{canvas: HTMLCanvasElement; vt: VexTab}} the Canvas element and the generated VexTab
     */
    function generateCanvas(tab) {
        let canvas = document.createElement("canvas");
        console.warn("Canvas size is limited, e.g. Chrome's canvas can only be 32,767x32,767 pixels. " +
            "If it exceeds, nothing will be displayed.");
        let vt = displayTablature(tab, canvas, true);
        return { canvas: canvas, vt: vt };
    }
    exports.generateCanvas = generateCanvas;
    /**
     * Generates an image from a tablature element
     * @param {Tablature} tab
     * @returns {{img: HTMLImageElement; vt: VexTab}} the Image element and the generated VexTab
     */
    function generateImage(tab) {
        let svg = generateSVG(tab); // uses SVG rendering instead of canvas because of size limitations
        let svgData = new XMLSerializer().serializeToString(svg.svg);
        let data = "data:image/svg+xml;base64," + btoa(svgData);
        let img = document.createElement("img");
        img.setAttribute('src', data);
        return { img: img, vt: svg.vt };
    }
    exports.generateImage = generateImage;
    /**
     * Parses the musicxml and produces a tablature
     * @param {string} xml the musicxml file as a string
     * @param {boolean} displayTab wether to display the tablature or not
     * @param {boolean} displayStave wether to display the music sheet or not
     * @returns {Promise<Tablature>} a future tablature
     */
    function parseXML(xml, displayTab, displayStave) {
        return Promise.resolve(null).then((_) => {
            let doc = mxl.parseScore(xml);
            // @Future let the user choose the part to play (and detect instrument)
            let partName = doc.partList[0].id;
            let times;
            let metronome;
            // The first measure contains general infos on the tablature
            // @Future read these infos on all tablatures, these mecanisms can change, the time signature could change etc.
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
                let chord; // constructs the chord iteratively
                for (let elem of docMeasure.parts[partName]) {
                    if (elem._class === "Attributes") {
                        let attributes = elem;
                        if (attributes.divisions) {
                            divisions = attributes.divisions; // override divisions
                        }
                    }
                    else if (elem._class === "Note") {
                        let note = elem;
                        // calculates the duration based on defined divisions and the duration
                        let duration = timeMap[1 / divisions * note.duration];
                        if (!duration) {
                            console.error(`Unable to parse the duration of the note. Duration input: ${note.duration}, divisions: ${divisions}`);
                            continue;
                        }
                        if (note.rest) {
                            if (chord && chord.notEmpty()) {
                                measure.addTime(chord); // validates previously made chord
                                chord = undefined; // for next note
                            }
                            measure.addTime(new vexmxl_tab_1.Rest(duration));
                        }
                        else if (note.pitch) {
                            let tech = note.notations[0].technicals[0]; // read note's tune
                            if (note.chord) {
                                // a chord must have been previously initialized
                                if (!chord)
                                    throw new Error("Chord element has not been initialized properly");
                            }
                            else {
                                if (chord && chord.notEmpty()) {
                                    measure.addTime(chord); // current note is for another chord, validates previous one
                                }
                                chord = new vexmxl_tab_1.Chord(duration); // initialize a new chord
                            }
                            let vNote = new vexmxl_tab_1.Note(tech.fret.fret, tech.string.stringNum);
                            if (tech.bend) {
                                vNote.bend(+tech.bend.bendAlter);
                            }
                            chord.addNote(vNote); // adds note to chord
                        }
                        else {
                            throw new Error("note has not been recognized");
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
    /**
     * Parse the MusicXML to a Tablature element for further displaying from a string value of the xml file
     * @param {string} xml
     * @param {boolean} displayTab
     * @param {boolean} displayStave
     * @returns {Promise<Tablature>}
     */
    function parseXMLFromString(xml, displayTab = true, displayStave = true) {
        return parseXML(xml, displayTab, displayStave);
    }
    exports.parseXMLFromString = parseXMLFromString;
    /**
     * Parse the MusicXML to a Tablature element for further displaying from a filepath to the xml file
     * @param {string} path
     * @param {boolean} displayTab
     * @param {boolean} displayStave
     * @returns {Promise<Tablature>}
     */
    function parseXMLFromFile(path, displayTab = true, displayStave = true) {
        return fetch(path).then((response) => {
            return response.text();
        }).then(str => {
            return parseXML(str, displayTab, displayStave);
        });
    }
    exports.parseXMLFromFile = parseXMLFromFile;
});
