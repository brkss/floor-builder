
import { COLORS } from './constants';
import { Line, Vector } from './types';

type dimension = {
	h: number,
	w: number
}


export const mapEncoder = (lines: Line[], d: dimension) => {

	const size : string = `[size]\n${d.w}:${d.h}\n`
	let walls : string = "[walls]\n";
	let windows : string = "[windows]\n";
	let doors : string = "[doors]\n";

	lines.map((line) => {
		if(line.color === COLORS.WALLCOLOR)
			walls += `line:[${line.pt1.x},${line.pt1.y}-${line.pt2.x},${line.pt2.y}]\n`
		else if(line.color === COLORS.WINDOWCOLOR)
			windows += `line:[${line.pt1.x},${line.pt1.y}-${line.pt2.x},${line.pt2.y}]\n`
		else if(line.color === COLORS.DOORCOLOR)
			doors += `line:[${line.pt1.x},${line.pt1.y}-${line.pt2.x},${line.pt2.y}]\n`
		return line;
	})

	return size + walls + windows + doors;
}
