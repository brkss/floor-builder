import React from 'react';
import { Box, Text } from '@chakra-ui/react'
import { Actions } from './types';
import { HiCursorArrowRays } from 'react-icons/hi2'

interface Props {
	action: Actions
}


export const ActionInfo : React.FC<Props> = ({action}) => {

	
	const [currentAction, setCurrentAction] = React.useState<string>("")

	React.useEffect(() => {
		if(action === Actions.ADDWALL)
			setCurrentAction("add wall")
		else if(action === Actions.ADDWINDOW)
			setCurrentAction("add window")
		else if(action === Actions.ADDPORTAL)
			setCurrentAction("add door")
		else if(action === Actions.DELETE)
			setCurrentAction("delete")
	}, [action])


	return (
		<Box zIndex={9999} pos={'absolute'} top={'20px'} left={'20px'} p={'5px 17px'} rounded={'50px'} fontSize={'12px'} fontWeight={'bold'} bg={'#ffffff69'} backdropFilter={'blur(40px)'}>
			<Text><HiCursorArrowRays style={{display: 'inline-block', marginBottom: '-2px'}} size={'14px'} /> {currentAction}</Text>
		</Box>
	)
}
