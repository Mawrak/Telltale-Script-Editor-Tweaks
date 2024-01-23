# Telltale-Script-Editor + Tweaks

Latest release: https://github.com/Telltale-Modding-Group/Telltale-Script-Editor-Tweaks/releases/tag/v3b.2.0

Original tool by Violet (droyti): https://github.com/Telltale-Modding-Group/Telltale-Script-Editor

An experimental script editor for Telltale games, written using Electron.

# Important information

- As of v3b.2.0, it is now possible to build and run scripts on games older than TWDTTDS. Check the settings to select the desired game. Most games from 58 to 67 should work. Support for older games is untested. API differences between games may be present that may prevent certain functions made for newer games work in older ones.
- Make sure to set the Priority settings correctly. Set to 30 if editing TWDTTDS's main menu (usually done when creating custom cutscenes). Set to 1100 if overwriting existing Telltale assets, or working with games other than TWDTTDS. Default is 30.
- Only runs on Windows systems as `ttarchext` is required to build ttarch2 archives. Supports Windows 7 and higher.

# How do I edit source code

You will need Node.js, Git, Electron and Electron Forge.

For running and building the project from source code start from here: https://www.electronforge.io

Or contact me (Mawrak) on the Telltale Modding Server (https://discord.gg/HqpnTenqwp).

You may need to disable antivirus when installing dependencies.

![Editor Window](/marketing/scripteditor.png?raw=true)

# Credits for v3b

Mawrak - figuring out the way to build the tool from source, fixing bugs, adding features, managing releases.

[Arizzble](https://www.youtube.com/@arizzble2005) (aizzble on Discord) - figuring out and testing ways to make the Script Editor works with games other than TWDTTDS.

# Credits for the original tool

Original tool was developed by: 

[Violet](https://github.com/droyti)

[Lightning](https://twitter.com/nekoblitz_)

[Ben O](https://github.com/bigbeno37)
