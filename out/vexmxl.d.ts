import "vexflow";
import { Tablature } from "./vexmxl.tab";
export declare function generateSVG(tab: Tablature): SVGElement;
export declare function generateCanvas(tab: Tablature): HTMLCanvasElement;
export declare function generateImage(tab: Tablature): HTMLImageElement;
export declare function parseXMLFromString(xml: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
export declare function parseXMLFromFile(path: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
