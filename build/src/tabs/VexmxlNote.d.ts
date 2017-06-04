import { VextabItem } from "./VextabItem";
export declare class VexmxlNote implements VextabItem {
    private fret;
    private str;
    constructor(fret: number, str: number);
    toString(): string;
}
