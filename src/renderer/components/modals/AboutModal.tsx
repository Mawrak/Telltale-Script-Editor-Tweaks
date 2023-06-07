import {Container, Stack, Title, Text} from '@mantine/core';
import * as React from 'react';
//Mawrak Tweaks - changed version to 3b, as it is different from the main one
export const AboutModal = () => {
	return <Container>
		<Stack align="center">
			<Title order={1}>Telltale Script Editor + Tweaks</Title>
			<Text>Version 3b.0.0</Text>
		</Stack>
	</Container>
};