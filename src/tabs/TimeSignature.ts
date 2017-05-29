export class TimeSignature {
	private base: number;
	private table: Map<number, string> = new Map();

	constructor(base: number) {
		this.base = base;
		this.table.set(base * 4,        'w');
		this.table.set(base * 3,        'hd');
		this.table.set(base * 2,        'h');
		this.table.set(base * (3/2.),   'qd');
		this.table.set(base,            'q');
		this.table.set(base * (3/4.),   '8d');
		this.table.set(base * (1/2.),   '8');
		this.table.set(base * (3/8.),   '16d');
		this.table.set(base * (1/4.),   '16');
		this.table.set(base * (3/16.),  '32d');
		this.table.set(base * (1/8.),   '32');
	}

	durationToTag(duration: number): string {
		let ret: string = this.table.get(duration);
		if (!ret) {
			let differences: number[] = Array.from(this.table.keys()).map(k => Math.abs(duration - k));
			let nearestIndex = differences.indexOf(Math.min(...differences));
			ret = this.table.get(Array.from(this.table.keys())[nearestIndex]);
		}
		return ret;
	}

	getBase(): number {
		return this.base;
	}
}