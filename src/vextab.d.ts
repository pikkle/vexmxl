// Type definitions for VexTab v0.0.1
// Project: VexTab from http://vexflow.com
// Definitions by: Loïc Serafin <https://github.com/pikkle>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import GhostNote = Vex.Flow.GhostNote;
import TabNote = Vex.Flow.TabNote;
declare interface ArtistOption {
	font_face?: string;
	font_size?: number;
	font_style?: string;
	bottom_spacing?: number;
	tab_stave_lower_spacing?: number;
	note_stave_lower_spacing?: number;
	scale?: number;
}

declare class Stave {
	tab_notes: (GhostNote | TabNote)[]
}

declare class Artist {
	public NOLOGO: boolean;
	constructor(x: number, y: number, width: number, options?: ArtistOption);
	public render(renderer: Vex.Flow.Renderer): void;
	public draw(renderer: Vex.Flow.Renderer): void;
	public getNoteForFret(fret: any, string: any): any;
	public parseBool(str: string): boolean;
	public staves: Stave[];

}

declare class VexTab {
	constructor(artist: Artist);
	public reset(): void;
	public isValid(): boolean;
	public getArtist(): Artist;
	public parseStaveOptions(options: any): any;
	public parseCommand(element: any): void;
	public parseChord(element: any): void;
	public parse(tab: string): void;
	public generate(): void;

}

declare module "VexTab" {
	export = VexTab;
}
