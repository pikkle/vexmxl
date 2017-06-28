import { VexMxlTab } from "./vexmxl.tab";
export declare namespace VexMxl {
    function generateSVG(tab: VexMxlTab.VexmxlTablature): HTMLDivElement;
    function generateCanvas(tab: VexMxlTab.VexmxlTablature): HTMLCanvasElement;
    function generateImage(tab: VexMxlTab.VexmxlTablature): HTMLImageElement;
    function parseXML(path: string, debug?: boolean): Promise<VexMxlTab.VexmxlTablature>;
}
