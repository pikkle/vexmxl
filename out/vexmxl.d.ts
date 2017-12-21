import "vexflow";
import { Tablature } from "./vexmxl.tab";
/**
 * Generates an SVG element from a tablature element
 * @param {Tablature} tab
 * @returns {{svg: SVGElement; vt: VexTab}} the SVG element and the generated VexTab
 */
export declare function generateSVG(tab: Tablature): {
    svg: SVGElement;
    vt: VexTab;
};
/**
 * Generates a Canvas element from a tablature element
 * @param {Tablature} tab
 * @returns {{canvas: HTMLCanvasElement; vt: VexTab}} the Canvas element and the generated VexTab
 */
export declare function generateCanvas(tab: Tablature): {
    canvas: HTMLCanvasElement;
    vt: VexTab;
};
/**
 * Generates an image from a tablature element
 * @param {Tablature} tab
 * @returns {{img: HTMLImageElement; vt: VexTab}} the Image element and the generated VexTab
 */
export declare function generateImage(tab: Tablature): {
    img: HTMLImageElement;
    vt: VexTab;
};
/**
 * Parse the MusicXML to a Tablature element for further displaying from a string value of the xml file
 * @param {string} xml
 * @param {boolean} displayTab
 * @param {boolean} displayStave
 * @returns {Promise<Tablature>}
 */
export declare function parseXMLFromString(xml: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
/**
 * Parse the MusicXML to a Tablature element for further displaying from a filepath to the xml file
 * @param {string} path
 * @param {boolean} displayTab
 * @param {boolean} displayStave
 * @returns {Promise<Tablature>}
 */
export declare function parseXMLFromFile(path: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
