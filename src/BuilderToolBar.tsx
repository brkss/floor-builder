import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineColumnHeight } from 'react-icons/ai'
import { BsPlusSquareDotted, BsDoorClosed } from "react-icons/bs"
import { TbWindow, TbWall } from 'react-icons/tb'

const _tmp = [
	{
		name: "new",
		Icon: AiOutlinePlus,
		subs: [
			{
				name: "door",
				Icon: BsDoorClosed
			},
			{
				name: "wall",
				Icon: TbWall,
			},
			{
				name: "window",
				Icon: TbWindow
			}
		]
	},
	{
		name: "edit",
		Icon: AiOutlineEdit,
	},
	{
		name: "delete",
		Icon: AiOutlineDelete
	},
	{
		name: "sector",
		Icon: BsPlusSquareDotted
	},
	{
		name: "depth",
		Icon: AiOutlineColumnHeight
	}
]

export const BuilderToolBar : React.FC = () => {

	return (
		<Center pos={'fixed'} h={'100vh'} right={0} zIndex={9}>
			<Box display={'flex'} flexDir={'column'} alignItems={'end'} p={'20px'}>
				{
					_tmp.map((item, key) => (
						<Box display={item.subs ? "flex" : "inherit"} flexDir={'row-reverse'} cursor={'pointer'}>
							<Box mb={'20px'} key={key} textAlign={'center'}>
								<Center h={'45px'} w={'45px'} bg={'white'} rounded={'100%'}>
									<item.Icon size={20} />
								</Center>
								<Text fontWeight={'bold'} color={'white'} fontSize={'12px'}>{item.name}</Text>
							</Box>
							<Box display={'flex'}>
								{
									item.subs && item.subs.map((sub, key) => (
										<Box mr={'20px'} key={key} textAlign={'center'}>
											<Center h={'45px'} w={'45px'} bg={'white'} rounded={'100%'}>
												<sub.Icon size={20} />
											</Center>
											<Text fontWeight={'bold'} color={'white'} fontSize={'12px'}>{sub.name}</Text>
										</Box>		
									))
								}
							</Box>
						</Box>
					))
				}
			</Box>
		</Center>
	)
}
