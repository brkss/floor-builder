import { KonvaEventListener, KonvaEventObject } from 'konva/lib/Node';
import React from 'react';
import { Line as LineShape, Stage, Layer, Circle, Group} from 'react-konva';
import { BuilderToolBar } from './BuilderToolBar';
import { Actions, Vector, Line } from './types';
import { 
	CALCULATE_DOT_POS, 
	ADJUST_LINE_WITH_GRID, 
	ADJUST_LINE ,
} from './helpers'
import { ActionInfo } from './ActionInfo';
import { COLORS } from './constants';
import { mapEncoder } from './encoder';

export const Application : React.FC = () => {

	const [action, setAction] = React.useState<Actions>(Actions.ADDWALL)
	const [lineColor, setLineColor] = React.useState<string>(COLORS.WALLCOLOR)
	const [pos, setPos] = React.useState<Vector>({x: 0, y: 0})
	const [startLine, setStartLine] = React.useState<boolean>(false);
	const [linePoints, setLinePoints] = React.useState<Line | null>(null);
	const [lines, setLines] = React.useState<Line[]>([]);

	const handlePointerMove = (evt: KonvaEventObject<PointerEvent>) => {
	 	const stage = evt.target.getStage();
		if(!stage)
			return;
    	
		const pointer = stage.getPointerPosition();	
		if(!pointer)
			return;
	
		const _x = (pointer.x - stage.x()) / stageProps.scale;
		const _y = (pointer.y - stage.y()) / stageProps.scale;
		setPos({
			x: _x, 
			y: _y
		});
		
		
		if(startLine)
			setLinePoints({...linePoints!, pt2: { x: _x, y: _y}});
	}

	const handleClick = (evt: KonvaEventObject<MouseEvent>) => {
		if(action !== Actions.ADDWALL && action !== Actions.ADDWINDOW && action !== Actions.ADDPORTAL)
			return;
		const stage = evt.target.getStage();
		if(!stage)
			return;
    	
		const pointer = stage.getPointerPosition();	
		if(!pointer)
			return;

		const _x = (pointer.x - stage.x()) / stageProps.scale;
		const _y = (pointer.y - stage.y()) / stageProps.scale;

		if(!startLine){
			setStartLine(true);
			setLinePoints({pt1: { x: _x, y: _y}, pt2:{ x: _x, y: _y}, color: lineColor});
		}else {
			setStartLine(false);
			setLinePoints({...linePoints!, pt2: { x: _x, y: _y}});
		
			// adjust drawed line !
			const line_with_grid = ADJUST_LINE_WITH_GRID(linePoints!);
			const new_line : Line = ADJUST_LINE(line_with_grid, lines);
			//console.log("new line angle : ", LINE_ANGLES(new_line));
			setLines([...lines, {...new_line, id: (lines.length + 1).toString()} as Line]);
			console.log("lines :", lines)


			setLinePoints(null);
		}
	}

	// handle viewporting
	const [stageProps, setStageProps] = React.useState({
		x: 0, // Initial X position
		y: 0, // Initial Y position
		scale: 1, // Initial scale (1 = 100%)
	});

	const handleWheel = (e: any) => {
		//e.preventDefault();
		e.evt.preventDefault();

		// Zooming based on the direction of the mouse scroll
		const scaleBy = 1.05;
		const stage = e.target.getStage();
		if (!stage)
			return;
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();

		const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

		const newX = pointer.x - pos.x * newScale;
      	const newY = pointer.y - pos.y * newScale;

		// Ensure zooming is within a reasonable range
		if (newScale >= 0.2 && newScale <= 3) {
			setStageProps({
				...stageProps,
				scale: newScale,
				x: newX,
        		y: newY,
			});
		}
	};

  	const dotPositions = CALCULATE_DOT_POS();

	const handleChangingAction = (ac: Actions) => {
		console.log("change action : ", ac)
		setAction(ac);
		if(ac === Actions.ADDWALL)
			setLineColor("white")
		else if(ac === Actions.ADDWINDOW)
			setLineColor(COLORS.WINDOWCOLOR)
		else if(ac === Actions.ADDPORTAL)
			setLineColor(COLORS.DOORCOLOR)
		
		console.log("line color :", lineColor)
	}
	
	// lines ops 
	const lineMouseEnter = (id?: string) => {
		if(!id)
			return;
		setLines(curr => curr.map(line => {
			if(line.id && line.id === id){
				line.opacity = .7
			}
			return line;
		}))
	}

	const lineMouseLeave = (id?: string) => {
		if(!id)
			return;
		setLines(curr => curr.map(line => {
			if(line.id && line.id === id){
				line.opacity = 1
			}
			return line;
		}))
	}

	const clickedOnLine = (id?: string) => {
		if(!id)
			return;
		if(action === Actions.DELETE){
			const _tmp = [...lines]
			const index = _tmp.findIndex(x => x.id === id)
			if(index < 0)
				return;
			_tmp.splice(index, 1)
			setLines([..._tmp]);
		}
	}


	// save project 
	const handleSave = () => {
		const map = mapEncoder(lines, { w: window.innerWidth, h: window.innerHeight });
		console.log("map : ", map);
	}
	return (
		<div >
			<ActionInfo action={action} />
			<BuilderToolBar action={handleChangingAction} save={handleSave} />
			<Stage 
				onWheel={handleWheel}
				width={window.innerWidth} 
				height={window.innerHeight} 
				style={{background: 'black'}} 
				onPointerMove={handlePointerMove} 
				onClick={handleClick}
				draggable={true}
				onDragEnd={(e) => {
					// Update the stage position after panning
					setStageProps({
						...stageProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				scaleX={stageProps.scale}
				scaleY={stageProps.scale}
				x={stageProps.x}
				y={stageProps.y}
				>
				<Layer >
					{dotPositions.map((position, index) => (
						<Circle
						  key={`dot-${index}`}
						  x={position.x}
						  y={position.y}
						  radius={1}
						  fill="red"
						/>
					  ))}
					<Circle 
						radius={5}
						fill={'white'}
						x={pos.x}
						y={pos.y}
					/>
					{
					startLine && linePoints ? 
						<LineShape
							//x={20}
							//y={200}
							points={[linePoints.pt1.x, linePoints.pt1.y, linePoints.pt2.x, linePoints.pt2.y]}
							tension={0.5}
							closed
							stroke="white"
						/>
					: null
					}
					{
					lines.map((line, key) => (

						<Group 
							key={key}
							onPointerEnter={(_) => lineMouseEnter(line.id)}
							onPointerLeave={(_) => lineMouseLeave(line.id)}
						>
							
							<LineShape
								onClick={(_) => clickedOnLine(line.id)}
								key={key}
								//x={20}
								//y={200}
								points={[
									line.pt1.x, 
									line.pt1.y, 
									line.pt2.x, 
									line.pt2.y
								]}
								tension={2}
								closed
								stroke={line.color}
								onPointerEnter={(_) => lineMouseEnter(line.id)}
								onPointerLeave={(_) => lineMouseLeave(line.id)}
								opacity={line.opacity || 1}
							/>
							<Circle 
								radius={3}
								fill={'white'}
								x={line.pt1.x}
								y={line.pt1.y}
							/>
							<Circle 
								radius={3}
								fill={'white'}
								x={line.pt2.x}
								y={line.pt2.y}
							/>
						</Group>
					))
					}
				</Layer>
			</Stage>
		</div>
	)
}
