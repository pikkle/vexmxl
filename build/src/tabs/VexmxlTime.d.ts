import { VextabItem } from "./VextabItem";
export declare abstract class VexmxlTime implements VextabItem {
    private duration;
    constructor(duration: string);
    toString(): string;
    setDuration(duration: string): void;
    protected abstract representation(): string;
}
