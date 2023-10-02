export interface Vector {
	x: number;
	y: number;
}

export interface Line {
	pt1: Vector;
	pt2: Vector;
}

export interface Data {
	width: number;
	height: number;
	walls: Line[];
	windows: Line[];
	doors: Line[];
}




export const parser = (map: string) => {
	const lines = map.split('\n');

	const data : Data = {
		width: -1,
		height: -1,
		walls: [],
		windows: [],
		doors: []
	}
	let category : string | null = null;

	lines.forEach((line) => {
		line = line.trim();
		let linePos : Line | null = null;

		if(line.startsWith("[") && line.endsWith("]")){
			category = line.slice(1, -1).toLowerCase();
		}else if (category === "size"){
			const parts = line.split(":")
			if(parts.length === 2){
				let d = {
					w : parseInt(parts[0].replace(/[^0-9.]/g, '')),
					h : parseInt(parts[1].replace(/[^0-9.]/g, '')),
				}
				data.width = d.w;
				data.height = d.h;
			}else {

			}
		}else if(category){
			const parts = line.split(":")
			if(parts.length === 2){
				const command = parts[0].trim().toLowerCase();
				const values = parts[1].trim().split('-')
				if(values.length === 2){
					const pt1_split = values[0].split(",")
					const pt2_split = values[1].split(",")
					if(pt1_split.length === 2 && pt2_split.length === 2){
						const pt1 : Vector = {
							x: parseFloat(pt1_split[0].replace(/[^0-9.]/g, '')),
							y: parseFloat(pt1_split[1].replace(/[^0-9.]/g, ''))
						};
						const pt2 : Vector = {
							x: parseFloat(pt2_split[0].replace(/[^0-9.]/g, '')),
							y: parseFloat(pt2_split[1].replace(/[^0-9.]/g, ''))
						};
						linePos = { pt1, pt2 }
					}else {
						//handle error
					}
				}

				switch (category) {
					case "walls":
						data[category].push(linePos!)
						break;
					case "windows":
						data[category].push(linePos!)
						break;
					case "doors":
						data[category].push(linePos!)
						break;
					default:
						break;
				}
			}

		}else {
			// handleError
		}
	})
	return data;
}
