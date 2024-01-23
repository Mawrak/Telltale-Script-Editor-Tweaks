import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useEffect, useState} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {useAppDispatch, useAppSelector} from './store';
import {RecentProject} from '../types';
import {createDebouncer} from '../utils';
import {setSelectedTheme} from '../renderer';

interface StorageState {
	initialised: boolean,
    gameNumber: number,
    PrioritySetting: number,
	gamePath?: string,
    modBuildPath?: string,
	sidebarWidth: number,
	recentProjects: RecentProject[],
	maximumBuildsToKeep: number,
	saveFilesOnBuild: boolean,
	selectedTheme: string
}

const initialState: StorageState = {
	initialised: false,
    gameNumber: 67,
	sidebarWidth: 250,
	recentProjects: [],
	maximumBuildsToKeep: 5,
	saveFilesOnBuild: true,
	selectedTheme: "light",
    PrioritySetting: 30
};

// NOTE: This is automatically synchronised with a config file on disk to persist data between application restarts.
export const StorageSlice = createSlice({
	name: 'storage',
	initialState,
	reducers: {
        //Mawrak Tweaks - new setting - Game number
        setGameNumber: (state, {payload}: PayloadAction<number>) => {
			state.gameNumber = payload
		},
        //Mawrak Tweaks - new setting - Priority
        setPrioritySetting: (state, {payload}: PayloadAction<number>) => {
			state.PrioritySetting = payload
		},
		setGamePath: (state, {payload}: PayloadAction<string | undefined>) => {
			state.gamePath = payload
		},
        //Mawrak Tweaks - new setting - Mod Folder
        setModPath: (state, {payload}: PayloadAction<string | undefined>) => {
			state.modBuildPath = payload
		},
		setSidebarWidth: (state, {payload}: PayloadAction<number>) => {
			state.sidebarWidth = Math.round(Math.max(payload, initialState.sidebarWidth));
		},
		addRecentProject: (state, {payload}: PayloadAction<RecentProject>) => {
			state.recentProjects = [payload, ...state.recentProjects.filter(recentProject => recentProject.tseprojPath !== payload.tseprojPath)];
		},
		removeRecentProject: (state, {payload}: PayloadAction<RecentProject>) => {
			state.recentProjects = state.recentProjects.filter(({ tseprojPath }) => tseprojPath !== payload.tseprojPath);
		},
		setMaximumBuildsToKeep: (state, {payload}: PayloadAction<number>) => {
			state.maximumBuildsToKeep = payload >= 0 ? payload : 0
		},
		setSaveFilesOnBuild: (state, {payload}: PayloadAction<boolean>) => {
			state.saveFilesOnBuild = payload
		},
		setTheme: (state, {payload}: PayloadAction<string>) => {
			state.selectedTheme = payload;

			setSelectedTheme(payload);
		},
		setStorageState: (state, {payload}: PayloadAction<StorageState>) => payload
	}
});

export const StorageActions = StorageSlice.actions;
export const StorageReducer = StorageSlice.reducer;

const debounce = createDebouncer();
// TODO: This can probably live next to the root store rather than needing hooks
export const useStorageStateSync = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector(state => state);
	const [initialised, setInitialised] = useState(false);

	useEffect(() => {
		(async () => {
			if (!initialised) {
				const storage = await MainProcess.getLocalStore();

				dispatch(StorageActions.setStorageState({ ...initialState, ...storage, initialised: true }));

				setInitialised(true);
			} else {
				debounce(() => {
					MainProcess.updateAppState(state);

					setSelectedTheme(state.storage.selectedTheme);
				}, 500);
			}
		})();
	}, [initialised, state]);
}