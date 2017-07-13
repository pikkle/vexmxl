import "vexflow";
import { Tablature } from "./vexmxl.tab";
export declare namespace VexMxl {
    function generateSVG(tab: Tablature): SVGElement;
    function generateCanvas(tab: Tablature): HTMLCanvasElement;
    function generateImage(tab: Tablature): HTMLImageElement;
    function parseXML(path: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
}
