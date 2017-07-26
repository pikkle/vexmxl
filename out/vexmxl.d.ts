import "vexflow";
import { Tablature } from "./vexmxl.tab";
export declare function displayTablature(tab: Tablature, div: HTMLElement, canvas: boolean): VexTab;
export declare function generateSVG(tab: Tablature): {
    svg: SVGElement;
    vt: VexTab;
};
export declare function generateCanvas(tab: Tablature): {
    canvas: HTMLCanvasElement;
    vt: VexTab;
};
export declare function generateImage(tab: Tablature): {
    img: HTMLImageElement;
    vt: VexTab;
};
export declare function parseXMLFromString(xml: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
export declare function parseXMLFromFile(path: string, displayTab?: boolean, displayStave?: boolean): Promise<Tablature>;
