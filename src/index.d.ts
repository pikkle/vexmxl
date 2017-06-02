// Type definitions for VexMXL v0.0.1
// Project: VexMxl
// Definitions by: Loïc Serafin <https://github.com/pikkle>

declare namespace VexMxl {

	/**
	 * Parses the XML file for a MusicXML document and returns a promise of a VexmxlTablature
	 * @param path the path to the MusicXML file (in .xml extension)
	 */
	function parseXML(path: string): Promise<VexmxlTablature>;

	/**
	 * Displays a tablature parsed into a DOM element in SVG format
	 * @param tab the tablature object parsed
	 * @param div the dom element in which the tablature will be engraved
	 */
	function displayTablature(tab: VexmxlTablature, div: HTMLElement): void;
}

declare interface VextabItem {
	toString(): string;
}

declare class VexmxlTablature implements VextabItem {
	constructor(displaySheet: boolean, scale: number);

	public addMeasure(measure: VexmxlMeasure): void;
}

declare class VexmxlMeasure implements VextabItem {
	constructor();

	public addTime(time: VexmxlTime): void;

	public notEmpty(): boolean;
}

declare abstract class VexmxlTime implements VextabItem {
	constructor(duration: string);

	public setDuration(duration: string);
}

declare class VexmxlChord extends VexmxlTime {
	public addNote(note: VexmxlNote): void;

	public notEmpty(): boolean;
}

declare class VexmxlRest extends VexmxlTime {}

declare class VexmxlNote implements VextabItem {
	constructor(fret: number, str: number);
}

