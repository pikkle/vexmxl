import "vexflow";
import { Tablature } from "./vexmxl.tab";
export declare function generateSVG(tab: Tablature): SVGElement;
export declare function generateCanvas(tab: Tablature): HTMLCanvasElement;
export declare function generateImage(tab: Tablature): HTMLImageElement;
export declare function parseXML(path: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
