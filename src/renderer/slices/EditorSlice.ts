import {OpenFile} from '../types';
import {createAsyncThunk, createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import { AppState, EditorFile } from '../../shared/types';
import {MainProcess} from '../MainProcessUtils';

interface EditorState {
	openFiles: OpenFile[],
	activeFileIndex?: number
}

const initialState: EditorState = {
	openFiles: []
};

const openFile = createAsyncThunk('editor/openfile', async (file: EditorFile) => {
	return { file, contents: await MainProcess.getFileContents(file.path) };
});

const saveFile = createAsyncThunk('editor/savefile', async (index: number, api) => {
	const state = api.getState() as AppState;
	const file = state.editor.openFiles[index];

	await MainProcess.saveFile({ path: file.file.path, contents: file.contents });

	return index;
});

const saveAllFiles = createAsyncThunk('editor/saveallfiles', async (_, api) => {
	const state = api.getState() as AppState;

	for (const file of state.editor.openFiles) {
		await MainProcess.saveFile({ path: file.file.path, contents: file.contents });
	}

	return;
});

const saveFileAndClose = createAsyncThunk('editor/savefileandclose', async (index: number, api) => {
	const state = api.getState() as AppState;
	const file = state.editor.openFiles[index];

	await MainProcess.saveFile({ path: file.file.path, contents: file.contents });

	return index;
});

const closeFileReducer = (state: Draft<EditorState>, { payload: indexToClose }: PayloadAction<number>) => {
	if (state.activeFileIndex === undefined) return;
    
	// Returns a new array without the element at position 'index'.
	// Might be a better way of doing things, but this works well enough...
    
    //Mawrak Tweaks - fixed critical issue that can cause data loss. 
    
    
    //the logic is the following:
    //the opened files are indexed from 0 to i
    //when closing a file, all indexes above the index of the closed file go down 1. So, index of file i becomes i-1. Etc. Files with indexes below closed file remain the same
    //then the script calculates which file to open next by looking for an index (newIndex)
    //the issue:
    //if newIndex == closed file index, then the editor tab wont reload data
    //however, since all indexes above closed file have 1 subtracted from them, if you apply the file above the closed file, it will have the same issue, and contents of the tab wont reload
    //by editing logic I can mitigate the issue in most cases by having it load the tab below, or the tab two indexes above
    //but in case when you only have two files opened, and close the first one (index 0), the only remaining file will have index 0 (same as closed tab), and the tab wont reload
    //this is terrible because it can lead to data loss
    //the only solution I can think of is to block closing the first tab if two (no less no more) tabs are open (its a terrible ugly solution but it will prevent data loss) 
    
    //Blocks closing the first tab when there are only two tabs. Terrible solution but I don't have anything better.
    
    //Extra block of Index 0 at EditorTab - closing index 0 is currently 100% blocked
    
	if ((state.openFiles.length === 2) && (indexToClose === 0) && state.activeFileIndex === 0) {return;}
    
    state.openFiles = state.openFiles.filter((_, i) => i !== indexToClose);
    
    

	if (indexToClose < state.activeFileIndex) {
		state.activeFileIndex--;
	}
    
	else if (state.activeFileIndex === indexToClose) {
		let newIndex = indexToClose;//Number(state.openFiles[0]);
        
        //Mawrak Tweaks - fixed critical issue that can cause data loss. 
        newIndex--
        
		//if (newIndex >= state.openFiles.length) newIndex--;

        if (newIndex < 0) {newIndex = 1;}
        
        
        
		state.activeFileIndex = newIndex >= 0 ? newIndex : undefined;

	}
};

export const EditorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		closeFile: closeFileReducer,
		setActiveFileIndex: (state, { payload }: PayloadAction<number | undefined>) => {
			state.activeFileIndex = payload;
		},
		setActiveFileContents: (state, { payload: newContents }: PayloadAction<string>) => {
			if (state.activeFileIndex === undefined) return;

			const openFile = state.openFiles[state.activeFileIndex];

			if (openFile.contents === newContents) return;

			openFile.contents = newContents;
			openFile.hasUnsavedChanges = true;
		},
		handleRename: (state, { payload: { oldPath, newPath } }: PayloadAction<{ oldPath: string, newPath: string }>) => {
			state.openFiles.forEach(openFile => {
				openFile.file.path = openFile.file.path.replace(oldPath, newPath)
			});
		},
		handleFileDeleted: (state, { payload }: PayloadAction<EditorFile>) => {
			state.openFiles.forEach((openFile, index) => {
				if (!openFile.file.path.includes(payload.path)) return;

				closeFileReducer(state, { payload: index, type: '' });
			});
		},
		clear: () => initialState
	},
	extraReducers: builder => {
		builder
			.addCase(openFile.fulfilled, (state, { payload: { file, contents } }) => {
				const path = file.path;

				if (!state.openFiles.some(({file}) => file.path === path)) {
					state.openFiles.push({ file, contents, hasUnsavedChanges: false });
				}

				state.activeFileIndex = state.openFiles.findIndex(({ file }) => file.path === path);
			})
			.addCase(saveFile.fulfilled, (state, { payload: index }) => {
				state.openFiles[index].hasUnsavedChanges = false;
			})
			.addCase(saveAllFiles.fulfilled, (state) => {
				for (const file of state.openFiles) {
					file.hasUnsavedChanges = false;
				}
			})
			.addCase(saveFileAndClose.fulfilled, (state, action) => {
				closeFileReducer(state, action);
			})
	}
});

export const EditorReducer = EditorSlice.reducer;
export const EditorActions = EditorSlice.actions;
export const EditorAsyncActions = { openFile, saveFile, saveAllFiles, saveFileAndClose };
