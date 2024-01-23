import {BrowserWindow, Menu, MenuItem, shell} from 'electron';
import {conditional, getIPCMainChannelSource, openBuildsDirectory} from './utils';
import {
	MenuAboutChannel,
	MenuBuildAndRunProjectChannel,
	MenuBuildProjectChannel,
	MenuCloseProjectChannel,
	MenuNewProjectChannel,
	MenuNotImplementedChannel,
	MenuOpenProjectChannel,
	MenuProjectSettingsChannel,
	MenuSettingsChannel,
    SaveFileChannel
} from '../shared/Channels';
import {AppState} from '../shared/types';




export const updateEditorMenu = (window: BrowserWindow, state: Readonly<AppState>): void =>
	window.setMenu(getEditorMenu(window, state));

export const getEditorMenu = (window: BrowserWindow, state: Readonly<AppState>) => {
	const source = getIPCMainChannelSource(window);

	// TODO: Remove once everything is good to go
	const notImplemented = () => MenuNotImplementedChannel(source).send();

    

    
    
    
	const projectOpen = !!state.project.currentProject;

	const ProjectMenu = {
		label: 'Project',
		submenu: [
			{
				label: 'Build',
				click: () => MenuBuildProjectChannel(source).send()
			},
			{
				label: 'Build and Run',
				click: () => MenuBuildAndRunProjectChannel(source).send()
			},
			{
				label: 'Project Settings',
				click: () => MenuProjectSettingsChannel(source).send()
			},
			{
				label: 'Open Builds Directory',
				click: () => openBuildsDirectory(state)
			}
		]
	};
    //Mawrak Tweaks - removing unused menu buttons (notImplemented ones)
	const FileSubmenu = [
		{
			label: 'New',
			submenu: [
				{
					label: 'Project',
					click: () => MenuNewProjectChannel(source).send()
				}//,
				//conditional(projectOpen,
				//{
				//	label: 'Script',
				//	click: notImplemented
				//})
			].filter(item => item)
		},
		{
			label: 'Open',
			submenu: [
				{
					label: 'Project',
					click: () => MenuOpenProjectChannel(source).send()
				}//,
				//{
				//	label: 'TTARCH2 Archive',
				//	click: notImplemented
				//}
			]
		},
        
        //Mawrak Tweaks - removing unused menu buttons
        
		//conditional(projectOpen,{
		//	label: 'Save',
		//	click:  notImplemented
                
		//}),
		//conditional(projectOpen, {
		//	label: 'Save As',
		//	click: notImplemented
		//}),
        
		conditional(projectOpen, {
			label: 'Close Project',
			click: () => MenuCloseProjectChannel(source).send()
		}),
		{
			label: 'Reload',
			click: () => window.reload()
		},
		{
			label: 'Settings',
			click: () => MenuSettingsChannel(source).send()
		},
		{
			label: 'Exit',
			click: () => window.close()
		}
	].filter(item => item);

	const template = [
		{
			label: 'File',
			submenu: FileSubmenu
		},
		{
			role: 'editMenu'
		},
		conditional(projectOpen, ProjectMenu),
		{
			label: 'Help',
			submenu: [
				{
                    //Mawrak Tweaks - changed links to my fork
					label: 'Docs',
					click: () => shell.openExternal('https://github.com/Mawrak/Telltale-Script-Editor-Tweaks')
				},
				{
					label: 'About',
					click: () => MenuAboutChannel(source).send()
				},
				{
					label: 'Contribute',
					click: () => shell.openExternal('https://github.com/Mawrak/Telltale-Script-Editor-Tweaks')
				}//,
				//{
				//	label: 'Debug',
				//	submenu: [
				//		{
				//			label: 'Verbose Output',
				//			click: notImplemented
				//		},
				//		{
				//			label: 'Show Project Info',
				//			click: notImplemented
				//		}
				//	]
				//}
			]
		}
	].filter(item => item) as unknown as MenuItem[];

	return Menu.buildFromTemplate(template);
}