import { VextabItem } from "./VextabItem";
import { VexmxlTime } from "./VexmxlTime";
export declare class VexmxlMeasure implements VextabItem {
    private times;
    constructor();
    addTime(time: VexmxlTime): void;
    toString(): string;
    notEmpty(): boolean;
}
