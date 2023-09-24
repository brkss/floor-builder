// needed types !
export interface Vector {
	x: number;
	y: number;
}

export interface Line {
	pt1: Vector;
	pt2: Vector;
	color: string;
}

// remove string values after !
export enum Actions {
	ADDWALL = "ADDWALL",
	ADDWINDOW = "ADDWINDOW",
	ADDPORTAL = "ADDPORTAL",
	DELETE = "DELETE",
	EDIT = "EDIT",
	DEPTH = "DEPTH",
	SECTOR = "SECTOR"
}
