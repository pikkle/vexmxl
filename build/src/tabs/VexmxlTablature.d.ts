import { VextabItem } from "./VextabItem";
import { VexmxlMeasure } from "./VexmxlMeasure";
export declare class VexmxlTablature implements VextabItem {
    private displaySheet;
    private scale;
    private measures;
    constructor(displaySheet?: boolean, scale?: number);
    addMeasure(measure: VexmxlMeasure): void;
    toString(): string;
}
