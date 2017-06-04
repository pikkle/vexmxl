import { VexmxlTablature } from "./tabs/VexmxlTablature";
export declare namespace VexMxl {
    function displayTablature(tab: VexmxlTablature, div: HTMLElement): void;
    function parseXML(path: string): Promise<VexmxlTablature>;
}
