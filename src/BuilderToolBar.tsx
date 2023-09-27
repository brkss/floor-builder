import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';
import { AiOutlineSave, AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineColumnHeight } from 'react-icons/ai'
import { BsPlusSquareDotted, BsDoorClosed } from "react-icons/bs"
import { TbWindow, TbWall } from 'react-icons/tb'
import { animated, useSpring } from '@react-spring/web'
import { Actions } from './types';

const AnimatedBox = animated(Box);

const _tmp = [
	{
		name: "new",
		Icon: AiOutlinePlus,
		action: Actions.ADDWALL,
		subs: [
			{
				name: "door",
				Icon: BsDoorClosed,
				action: Actions.ADDPORTAL
			},
			{
				name: "wall",
				Icon: TbWall,
				action: Actions.ADDWALL
			},
			{
				name: "window",
				Icon: TbWindow,
				action: Actions.ADDWINDOW
			}
		]
	},
	{
		name: "edit",
		Icon: AiOutlineEdit,
		action: Actions.EDIT
	},
	{
		name: "delete",
		Icon: AiOutlineDelete,
		action: Actions.DELETE
	},
	{
		name: "sector",
		Icon: BsPlusSquareDotted,
		action: Actions.SECTOR
	},
	{
		name: "depth",
		Icon: AiOutlineColumnHeight,
		action: Actions.DEPTH
	}
]

interface Props {
	action: (action: Actions) => void;
	save: () => void;
}

export const BuilderToolBar : React.FC<Props> = ({action, save}) => {

	const [{opacity, y}, set] = useSpring(() => ({ opacity: 0, y: 0 }))

	const handleHoverIn = (run: number) => {
		if(run === 0)
			return;
		set({opacity: 1, y: -20})
	}

	const handleHoverOut = (run: number) => {
		if(run === 0)
			return;
		set({opacity: 0, y: 0})
	}

	return (
		<Center pos={'fixed'} h={'100vh'} right={0} zIndex={9}>
			
			<Box display={'flex'} flexDir={'column'} alignItems={'end'} p={'20px'} cursor={'pointer'}>
				<Box 
					transition={'.3s'} 
					_hover={{transform: 'translateY(-5px)', transition: '.3s'}} 
					mb={'20px'} 
					textAlign={'center'} 
					onClick={save} >
					<Center h={'45px'} w={'45px'} bg={'white'} rounded={'100%'}>
						<AiOutlineSave size={20} />
					</Center>
					<Text fontWeight={'bold'} color={'white'} fontSize={'12px'}>Save</Text>
				</Box>
				{
					_tmp.map((item, key) => (
						<Box  key={key} display={item.subs ? "flex" : "inherit"} flexDir={'row-reverse'} cursor={'pointer'}>
							<Box transition={'.3s'} _hover={{transform: 'translateY(-5px)', transition: '.3s'}} mb={'20px'} key={key} textAlign={'center'} onMouseEnter={(_) => handleHoverIn(item.subs?.length || 0)} onMouseLeave={(_) => handleHoverOut(item.subs?.length || 0)} onClick={() => action(item.action!)} >
								<Center h={'45px'} w={'45px'} bg={'white'} rounded={'100%'}>
									<item.Icon size={20} />
								</Center>
								<Text fontWeight={'bold'} color={'white'} fontSize={'12px'}>{item.name}</Text>
							</Box>
							{<Box display={'flex'} onMouseEnter={(_) => handleHoverIn(item.subs?.length || 0)} onMouseLeave={(_) => handleHoverOut(item.subs?.length || 0)} >
								{
									item.subs && item.subs.map((sub, key) => (
										<AnimatedBox mr={'20px'}  key={key} textAlign={'center'}  style={{opacity, transform: y.interpolate(v => `translateX(${v}%`)}} onClick={() => action(sub.action)} >
											<Center transition={'.3s'} _hover={{transform: 'translateY(-5px)', transition: '.3s'}} h={'45px'} w={'45px'} bg={'white'} rounded={'100%'}>
												<sub.Icon size={20} />
											</Center>
											<Text  fontWeight={'bold'} color={'white'} fontSize={'12px'}>{sub.name}</Text>
										</AnimatedBox>		
									))
								}
							</Box>}
						</Box>
					))
				}
			</Box>
		</Center>
	)
}
