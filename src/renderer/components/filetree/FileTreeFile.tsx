import {Button, Group, Modal, Portal, Space, Stack, Text, TextInput, Title} from '@mantine/core';
import * as React from 'react';
import {EditorFile} from '../../../shared/types';
import styles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {isSupported} from '../../FileUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions, FileTreeAsyncActions} from '../../slices/FileTreeSlice';
import {EditorActions, EditorAsyncActions} from '../../slices/EditorSlice';
import {showNotification} from '@mantine/notifications';
import {ControlledMenu, SubMenu, useMenuState} from '@szhsin/react-menu';
import {MouseEventHandler, useState} from 'react';
import {MainProcess} from '../../MainProcessUtils';
import {ContextMenuItem} from './ContextMenuItem';

type FileTreeFileProps = {
	file: EditorFile,
	indentation: number
};

export const FileTreeFile = ({file, indentation}: FileTreeFileProps) => {
	const dispatch = useAppDispatch();

	const selectedPath = useAppSelector(state => state.filetree.selectedPath);
	const selected = selectedPath === file.path;
	const supported = isSupported(file);
	const newFilePath = useAppSelector(state => state.filetree.newFilePath);

	const handleClick = () => dispatch(FileTreeActions.setSelectedPath(file.path));
	const handleDoubleClick = () => {
		if (!supported) {
			return showNotification({
				title: 'Unable to open file',
				message: `${file.name} is an unsupported file.`,
				color: 'red'
			});
		}

		dispatch(EditorAsyncActions.openFile(file));
	}

	const [menuProps, toggleMenu] = useMenuState();
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0});

	const [renaming, setRenaming] = useState(newFilePath === file.path);
	const [newFileName, setNewFileName] = useState(file.name);

	const handleRename = () => {
		setRenaming(true);
	};

	const handleRenameSubmit = async () => {
		if (newFileName !== file.name) {
			const newPath = await MainProcess.renameFile({ file, newName: newFileName });

			// If we're renaming the root directory, a normal refresh will no longer find the root.
			if (indentation === 0) {
				dispatch(FileTreeAsyncActions.setRootDirectoryFromPath(newPath));
			} else {
				dispatch(FileTreeAsyncActions.refreshRootDirectory())
			}

			dispatch(EditorActions.handleRename({ oldPath: file.path, newPath }));
		}

		setRenaming(false);
	};

	const handleRightClick: MouseEventHandler<HTMLDivElement> = e => {
		handleClick();
		setAnchorPoint({ x: e.clientX, y: e.clientY});
		toggleMenu(true);
	};

	const handleOpenInExplorer = () => {
		MainProcess.openInExplorer(file.path);
	};

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const hideDeleteModal = () => setShowDeleteModal(false);

	const handleDeleteDirectory = async () => {
		hideDeleteModal();

		await MainProcess.deleteFile(file);

		dispatch(FileTreeAsyncActions.refreshRootDirectory());
		dispatch(EditorActions.handleFileDeleted(file));
	};

	return <>
		<Modal
			centered
			withCloseButton={false}
			opened={showDeleteModal}
			onClose={hideDeleteModal}
			size="sm"
		>
			<Stack>
				<Title order={2}>Delete File</Title>
				<Text>Are you sure you want to delete <em>{file.name}</em>?</Text>
				<Space h="md" />
				<Group position="right" spacing="xs">
					<Button color="gray" onClick={hideDeleteModal}>Cancel</Button>
					<Button color="red" onClick={handleDeleteDirectory}>
						Delete
					</Button>
				</Group>
			</Stack>
		</Modal>

		<Portal>
			<ControlledMenu
				direction="right"
				anchorPoint={anchorPoint}
				onClose={() => toggleMenu(false)}
				{...menuProps}
			>
				<ContextMenuItem onClick={handleDoubleClick}>Open</ContextMenuItem>
				<ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
				<ContextMenuItem onClick={handleOpenInExplorer}>Open in explorer</ContextMenuItem>
				<ContextMenuItem onClick={() => setShowDeleteModal(true)}>Delete</ContextMenuItem>
			</ControlledMenu>
		</Portal>
		<div
			className={classNames({[styles.selected]: selected})}
			style={{paddingLeft: `${indentation + 1.4}rem`}}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onContextMenu={handleRightClick}
		>
			{ renaming
				// Using a form here SOLELY to make it easier to listen for enter pressed
				? <form onSubmit={e => { e.preventDefault(); handleRenameSubmit(); } } style={{ width: '100%' }}>
					<TextInput
						autoFocus
						value={newFileName}
						onChange={e => setNewFileName(e.target.value)}
						size="xs"
						styles={{ root: { width: '100%' } }}
						onBlur={handleRenameSubmit}
					/>
				</form>
				: <Text className={classNames(styles.text, {[styles.unsupported]: !supported})}>
					{file.name}
				</Text>
			}
		</div>
	</>
};