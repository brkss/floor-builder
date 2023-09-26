import { Line, Vector, } from './types';

export const GET_EDIT_LINE_ID = (ld: string) => {
	return ld.split(":")[0];
}

export const GET_EDIT_LINE_PT = (ld: string) => {
	return ld.split(":")[1];
}

export const CALCULATE_DOT_POS = () : Vector[] => {
		const positions = [];
		for (let x = 0; x < window.innerWidth * 1.5; x += 40) {
		  for (let y = 0; y < window.innerHeight ; y += 40) {
			positions.push({ x, y });
		  }
		}
		return positions;
};


const CPD = (pt1: Vector, pt2: Vector) => {
	return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2))
}

export const ADJUST_LINE_WITH_GRID = (line: Line) : Line => {
	const grid = CALCULATE_DOT_POS();
	
	let new_pt1 : Vector =  {...line.pt1};
	let new_pt2 : Vector =  {...line.pt2};

	for(let i = 0; i < grid.length; i++){
		if(CPD(line.pt1, grid[i]) < 20){
			new_pt1 = grid[i];		
		}else if (CPD(line.pt2, grid[i]) < 20){
			new_pt2 = grid[i];
		}
	}

	return {pt1: new_pt1, pt2: new_pt2, color: line.color};
}

export const ADJUST_LINE = (line: Line, lines: Line[]) : Line => {
	if(lines.length === 0)
		return (line)
	let pt1_close = lines[0].pt1;
	let pt2_close = lines[0].pt2;

	lines.forEach((l) => {
		if(CPD(l.pt1, line.pt1) < CPD(line.pt1, pt1_close)){
			pt1_close = l.pt1;
		}else if(CPD(l.pt2, line.pt1) < CPD(line.pt1, pt1_close)){
			pt1_close = l.pt2;
		}else if(CPD(l.pt1, line.pt2) < CPD(line.pt2, pt2_close)){
			pt2_close = l.pt1;
		}else if(CPD(l.pt2, line.pt2) < CPD(line.pt2, pt2_close)){
			pt2_close = l.pt2
		}
	});

	if(CPD(line.pt1, pt1_close) > 35)
		pt1_close = line.pt1;
	if(CPD(line.pt2, pt2_close) > 35)
		pt2_close = line.pt2;

	const adjusted_line : Line = { pt1: pt1_close, pt2: pt2_close, color: line.color }
	return adjusted_line;
}
