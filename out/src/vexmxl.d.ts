import { VexMxlTab } from "./vexmxl.tab";
export declare namespace VexMxl {
    function displayTablature(tab: VexMxlTab.VexmxlTablature, div: HTMLElement): void;
    function parseXML(path: string): Promise<VexMxlTab.VexmxlTablature>;
}
