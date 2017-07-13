import { VexMxlTab } from "./vexmxl.tab";
import "vexflow";
export declare namespace VexMxl {
    function generateSVG(tab: VexMxlTab.VexmxlTablature): SVGElement;
    function generateCanvas(tab: VexMxlTab.VexmxlTablature): HTMLCanvasElement;
    function generateImage(tab: VexMxlTab.VexmxlTablature): HTMLImageElement;
    function parseXML(path: string, displayTab?: boolean, displayStave?: boolean): Promise<VexMxlTab.VexmxlTablature>;
}
