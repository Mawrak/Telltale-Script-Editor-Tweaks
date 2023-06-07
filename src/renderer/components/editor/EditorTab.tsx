import {AiOutlineClose, AiFillSave} from 'react-icons/ai';
import * as React from 'react';
import styles from './EditorTab.module.css';
import {OpenFile} from '../../types';
import {useAppDispatch} from '../../slices/store';
import {EditorActions, EditorAsyncActions} from '../../slices/EditorSlice';
import {MouseEventHandler, useState} from 'react';
import {Button, Group, Modal, Space, Stack, Title, Text} from '@mantine/core';

type EditorTabProps = {
	openFile: OpenFile,
	index: number
};

export const EditorTab = ({ openFile, index }: EditorTabProps) => {
	const dispatch = useAppDispatch();

	const [showModal, setShowModal] = useState(false);

	const hideModal = () => setShowModal(false);

	const handleClose: MouseEventHandler<HTMLDivElement> = e => {
    
		e.stopPropagation();
        //Mawrak Tweaks - have to block to prevent bugs leading to data loss
        if (index === 0) {return;}
        
		if (!openFile.hasUnsavedChanges) return dispatch(EditorActions.closeFile(index));
		setShowModal(true);
	};

	const handleDiscardChanges = () => {
		dispatch(EditorActions.closeFile(index));
		hideModal();
	};

	const handleSaveChanges = () => {
		dispatch(EditorAsyncActions.saveFileAndClose(index));
		hideModal();
	};
    
    //Mawrak's Tweaks
    const handleSaveChanges_Tweaked = () => {
		dispatch(EditorAsyncActions.saveFile(index));
		hideModal();
	};
    
    
	const label = openFile.file.name.includes('.tseproj') ? 'Project Settings' : openFile.file.name;

	return <>
		<Modal
			centered
			withCloseButton={false}
			opened={showModal}
			onClose={hideModal}
		>
			<Stack>
				<Title order={2}>Unsaved Changes</Title>
				<Text>Do you want to save changes before closing?</Text>
				<Space h="md" />
				<Group position="right" spacing="xs">
					<Button color="gray" onClick={hideModal}>Cancel</Button>
					<Button color="red" onClick={handleDiscardChanges}>
						Discard
					</Button>
					<Button color="green" onClick={handleSaveChanges}>
						Save
					</Button>
				</Group>
			</Stack>
		</Modal>
		<div className={styles.container}>
			<span className={styles.label}>{label} {openFile.hasUnsavedChanges ? '(*)' : ''}</span>
            <div onClick={handleSaveChanges_Tweaked} className={styles.closeButton}><AiFillSave /></div>
			<div onClick={handleClose} className={styles.closeButton}><AiOutlineClose /></div>
		</div>

	</>;
};