import { KonvaEventObject } from 'konva/lib/Node';
import React from 'react';
import { Line, Stage, Layer, Circle} from 'react-konva';



interface Vector {
	x: number;
	y: number;
}

interface Line {
	pt1: Vector;
	pt2: Vector;
}

export const Application : React.FC = () => {

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
			setLinePoints({pt1: linePoints!.pt1, pt2: { x: evt.evt.x, y: evt.evt.y}});
	}

	const handleClick = (evt: KonvaEventObject<MouseEvent>) => {
		if(stageProps.scale !== 1){
			setStageProps({...stageProps, scale: 1})
			return;
		}
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
			setLinePoints({pt1: { x: _x, y: _y}, pt2:{ x: _x, y: _y} });
		}else {
			setStartLine(false);
			setLinePoints({pt1: linePoints!.pt1, pt2: { x: _x, y: _x}});
			setLines([...lines, linePoints as Line]);
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

	const calculateDotPositions = () => {
    const positions = [];
    for (let x = 0; x < window.innerWidth * 1.5; x += 40) {
      for (let y = 0; y < window.innerHeight * 1.5; y += 40) {
        positions.push({ x, y });
      }
    }
    return positions;
  };

  const dotPositions = calculateDotPositions();


	return (
		<div >
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
						<Line
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

						<div>
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
							<Line
								key={key}
								//x={20}
								//y={200}
								points={[line.pt1.x, line.pt1.y, line.pt2.x, line.pt2.y]}
								tension={0.2}
								closed
								stroke="white"
							/>
						</div>
					))
					}
				</Layer>
			</Stage>
		</div>
	)
}
