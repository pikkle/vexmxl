// Type definitions for VexTab v0.0.1
// Project: http://vexflow.com
// Definitions by: Loïc Serafin <https://github.com/pikkle>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import Renderer = Vex.Flow.Renderer;
declare interface ArtistOption {
	font_face?: string;
	font_size?: number;
	font_style?: string;
	bottom_spacing?: number;
	tab_stave_lower_spacing?: number;
	note_stave_lower_spacing?: number;
	scale?: number;
}

declare class Artist {
	constructor(x: number, y: number, width: number, options?: ArtistOption);
	render(renderer: Renderer): void;
}

declare class VexTab {
	constructor(artist: Artist);
	isValid(): boolean;
	getArtist(): Artist;
	parseStaveOptions(options: any): any;
	parse(tab: string): void;

}
