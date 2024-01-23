import * as React from 'react';
import {ActionIcon, Button, Container, Group, NumberInput, Space, Stack, TextInput, Title, Checkbox, Select} from '@mantine/core';
import {AiOutlineFolder} from 'react-icons/ai';
import {MainProcess} from '../../MainProcessUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {ContextModalProps} from '@mantine/modals';
import {StorageActions} from '../../slices/StorageSlice';
import {OverlayActions} from '../../slices/OverlaySlice';

export const SettingsModal = ({context, id}: ContextModalProps) => {
	const dispatch = useAppDispatch();
    //Mawrak Tweaks - new setting - Game number
    const gameNumber = useAppSelector(state => state.storage.gameNumber);
    //Mawrak Tweaks - new setting - Priority
    const PrioritySetting = useAppSelector(state => state.storage.PrioritySetting)
	const gameExePath = useAppSelector(state => state.storage.gamePath);
	const maximumBuildsToKeep = useAppSelector(state => state.storage.maximumBuildsToKeep);
	const saveFilesOnBuild = useAppSelector(state => state.storage.saveFilesOnBuild);
	const selectedTheme = useAppSelector(state => state.storage.selectedTheme);
    //Mawrak Tweaks - new setting - Mod Folder
    const modBuildPath2 = useAppSelector(state => state.storage.modBuildPath);

	const handleFolderClicked = async () => {
		dispatch(OverlayActions.show());

		const gamePath = await MainProcess.getGamePath();

		if (gamePath) dispatch(StorageActions.setGamePath(gamePath));

		dispatch(OverlayActions.hide());
	};
    
    //const handleFolderClickedModPath = async () => {
	//	dispatch(OverlayActions.show());

	//	const modBuildPath = await MainProcess.getGamePath();

	//	if (modBuildPath) dispatch(StorageActions.setModPath(modBuildPath));

	//	dispatch(OverlayActions.hide());
	//};
    
    
    

	return <Container>
		<Stack>
			<Title order={1}>Settings</Title>
           <Select
				required
				label="Select Target Game"
				placeholder="Pick a game to set Game number."
                description="Most games from 58 to 67 should work. Support for older games is untested."
				defaultValue={String(gameNumber)}
				data={[
					{ value: '0', label: '0   Wallace & Gromit: Episode 1: Fright of the Bumblebees' },
					{ value: '1', label: '1   Wallace & Gromit: Episode 2: The Last Resort' },
					{ value: '2', label: '2   Wallace & Gromit: Episode 3: Muzzled' },
					{ value: '3', label: '3   Telltale Texas Hold-em' },
                    { value: '4', label: '4   Bone: Out From Boneville' },
					{ value: '5', label: '5   Bone: The Great Cow Race' },
					{ value: '6', label: '6   Sam & Max: Episode 101 - Culture Shock' },
					{ value: '7', label: '7   Sam & Max: Episode 102 - Situation: Comedy' },
                    { value: '8', label: '8   Sam & Max: Episode 103 - The Mole, The Mob, and the Meatball' },
					{ value: '9', label: '9   Sam & Max: Episode 104 - Abe Lincoln Must Die!' },
                    { value: '10', label: '10  Sam & Max: Episode 105 - Reality 2.0' },
					{ value: '11', label: '11  Sam & Max: Episode 106 - Bright Side of the Moon' },
					{ value: '12', label: '12  Sam & Max: Episode 201 - Ice Station Santa' },
					{ value: '13', label: '13  Sam & Max: Episode 202 - Moai Better Blues' },
                    { value: '14', label: '14  Sam & Max: Episode 203 - Night of the Raving Dead' },
					{ value: '15', label: '15  Sam & Max: Episode 204 - Chariots of the Dogs' },
					{ value: '16', label: '16  Sam & Max: Episode 205 - Whats New, Beelzebub' },
					{ value: '17', label: '17  Strong Bad: Episode 1 - Homestar Ruiner' },
                    { value: '18', label: '18  Strong Bad: Episode 2 - Strong Badia the Free' },
					{ value: '19', label: '19  Strong Bad: Episode 3 - Baddest of the Bands' },
                    { value: '20', label: '20  Strong Bad: Episode 4 - Daneresque 3' },
					{ value: '21', label: '21  Strong Bad: Episode 5 - 8-Bit Is Enough' },
					{ value: '22', label: '22  CSI 3 - Dimensions of Murder / Bone demo' },
					{ value: '23', label: '23  CSI 4 - Hard Evidence (demo)' },
                    { value: '24', label: '24  Tales of Monkey Island 101: Launch of the Screaming Narwhal' },
					{ value: '25', label: '25  Wallace & Gromit: Episode 4: The Bogey Man' },
					{ value: '26', label: '26  Tales of Monkey Island 102: The Siege of Spinner Cay' },
					{ value: '27', label: '27  Tales of Monkey Island 103: Lair of the Leviathan' },
                    { value: '28', label: '28  CSI 5 - Deadly Intent' },
					{ value: '29', label: '29  Tales of Monkey Island 104: The Trial and Execution of Guybrush Threepwood' },
                    { value: '30', label: '30  CSI 4 - Hard Evidence' },
					{ value: '31', label: '31  Tales of Monkey Island 105: Rise of the Pirate God' },
					{ value: '32', label: '32  CSI 5 - Deadly Intent (demo)' },
					{ value: '33', label: '33  Sam & Max: Episode 301 - The Penal Zone' },
                    { value: '34', label: '34  Sam & Max: Episode 302 - The Tomb of Sammun-Mak' },
					{ value: '35', label: '35  Sam & Max: Episode 303 - They Stole Maxs Brain!' },
					{ value: '36', label: '36  Puzzle Agent - The Mystery of Scoggins' },
					{ value: '37', label: '37  Sam & Max: Episode 304 - Beyond the Alley of the Dolls' },
                    { value: '38', label: '38  Sam & Max: Episode 305 - The City That Dares Not Sleep' },
					{ value: '39', label: '39  Poker Night at the Inventory' },
                    { value: '40', label: '40  CSI 6 - Fatal Conspiracy' },
					{ value: '41', label: '41  Back To The Future: Episode 1 - Its About Time' },
					{ value: '42', label: '42  Back To The Future: Episode 2 - Get Tannen!' },
					{ value: '43', label: '43  Back To The Future: Episode 3 - Citizen Brown' },
                    { value: '44', label: '44  Hector: Episode 1 - We Negotiate with Terrorists' },
					{ value: '45', label: '45  Back To The Future: Episode 4 - Double Visions' },
					{ value: '46', label: '46  Back To The Future: Episode 5 - OUTATIME' },
					{ value: '47', label: '47  Puzzle Agent 2' },
                    { value: '48', label: '48  Jurassik Park: The Game' },
					{ value: '49', label: '49  Hector: Episode 2 - Senseless Act of Justice' },
                    { value: '50', label: '50  Hector: Episode 3 - Beyond Reasonable Doom' },
					{ value: '51', label: '51  Law and Order: Legacies' },
					{ value: '52', label: '52  Walking Dead: A New Day' },
					{ value: '53', label: '53  Poker Night 2' },
                    { value: '54', label: '54  The Wolf Among Us' },
					{ value: '55', label: '55  The Walking Dead: Season 2' },
					{ value: '56', label: '56  Tales from the Borderlands' },
					{ value: '57', label: '57  Game of Thrones' },
                    { value: '58', label: '58  Minecraft: Story Mode' },
					{ value: '59', label: '59  The Walking Dead: Michonne' },
                    { value: '60', label: '60  Batman: The Telltale Series' },
					{ value: '61', label: '61  The Walking Dead: A New Frontier' },
					{ value: '62', label: '62  Marvels Guardians of the Galaxy' },
					{ value: '63', label: '63  Minecraft: Story Mode - Season Two' },
                    { value: '64', label: '64  Batman: The Enemy Within' },
					{ value: '65', label: '65  Bone: Out From Boneville 2.0' },
					{ value: '66', label: '66  Bone: The Great Cow Race 2.0' },
                    { value: '67', label: '67  The Walking Dead: The Telltale Definitive Series' },
				]}
				onChange={e => dispatch(StorageActions.setGameNumber(Number(e) ??  Number('67')))}
			/>
            <NumberInput
				required
				label="ttarchext Game number"
				description="Default is 67 (TWDTTDS)."
				value={gameNumber}
				onChange={e => dispatch(StorageActions.setGameNumber(e ?? 67))}
			/>
            <NumberInput
				required
				label="Priority"
				description="Set to 30 if editing TWDTTDS's main menu. Set to 1100 if overwriting existing Telltale assets. Default is 30."
				value={PrioritySetting}
				onChange={e => dispatch(StorageActions.setPrioritySetting(e ?? 30))}
			/>
			<TextInput
				required
				label="Game Executable"
				placeholder="C:\path\to\WDC.exe"
				value={gameExePath}
				onChange={e => dispatch(StorageActions.setGamePath(e.target.value))}
				rightSection={<ActionIcon onClick={handleFolderClicked} color="dark"><AiOutlineFolder /></ActionIcon>}
			/>
            <TextInput
				required
				label="Mod folder path. Enter full path only, for build-and-run, should be located somewhere in root directory of the game. Example: Z:\TWDTTDS\My_Mod_Folder. Defaults to TWDTTDS\Archives folder if left empty."
				placeholder="!!Archives!!"
				value={modBuildPath2}
				onChange={e => dispatch(StorageActions.setModPath(e.target.value))}
			/>
			<NumberInput
				required
				label="Maximum builds to keep"
				description="(Enter 0 to keep all builds)"
				min={0}
				value={maximumBuildsToKeep}
				onChange={e => dispatch(StorageActions.setMaximumBuildsToKeep(e ?? 0))}
			/>
			<Checkbox
				required
				label="Automatically save all open files on Build"
				checked={saveFilesOnBuild}
				onChange={e => dispatch(StorageActions.setSaveFilesOnBuild(e.currentTarget.checked))}
			/>
			<Select
				required
				label="Editor Theme"
				placeholder="Pick one"
				defaultValue={selectedTheme}
				data={[
					{ value: 'light', label: 'A New Day' },
					{ value: 'dark', label: 'No Time Left' },
					{ value: 'darkAlt', label: 'All That Remains' },
					{ value: 'midnight', label: 'A House Divided' },
				]}
				onChange={e => dispatch(StorageActions.setTheme(e ?? 'light'))}
			/>
			<Space h="xl" />
			<Group position="right">
				<Button color='gray' onClick={() => context.closeModal(id)}>Close</Button>
			</Group>
		</Stack>
	</Container>
};