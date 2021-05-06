define([
	"./constants"
], function(
	k
) {
	const DefaultShortcuts = {
		[k.Shortcuts.MRUSelect]: "w",
			// on Linux, the extension menu can't seem to capture ctrl-W, like
			// macOS, so default to a different shortcut
		[k.Shortcuts.CloseTab]: k.IsLinux ? "ctrl+alt+w" : "ctrl+w",
		[k.Shortcuts.MoveTabLeft]: "ctrl+[",
		[k.Shortcuts.MoveTabRight]: "ctrl+]",
		[k.Shortcuts.CopyURL]: "mod+c",
		[k.Shortcuts.CopyTitleURL]: "mod+shift+c",
		[k.Shortcuts.SelectPreviousItem]: "ctrl+p",
		[k.Shortcuts.SelectNextItem]: "ctrl+n",
		[k.Shortcuts.EscapeBehavior]: "",
	};
		// we can't use cmd+W on Mac to close the tab selected in the menu
		// because the browser intercepts that and closes the current tab, so
		// append an override of cmd+ctrl+w
	const MacDefaults = Object.assign({}, DefaultShortcuts,
		{ [k.Shortcuts.CloseTab]: "cmd+ctrl+w" });
	const DefaultSettings = {
		[k.SpaceBehavior.Key]: k.SpaceBehavior.Select,
		[k.EscBehavior.Key]: k.EscBehavior.Clear,
		[k.HomeEndBehavior.Key]: k.HomeEndBehavior.ResultsList,
		[k.MarkTabsInOtherWindows.Key]: true,
		[k.IncludeClosedTabs.Key]: true,
		[k.ShowTabCount.Key]: false,
		[k.UsePinyin.Key]: false,
		[k.RestoreLastQuery.Key]: false,
		[k.ShowBookmarkPaths.Key]: true,
		[k.Shortcuts.Key]: {
			mac: MacDefaults,
			win: DefaultShortcuts
		}
	};


	return function getDefaultSettings()
	{
		return JSON.parse(JSON.stringify(DefaultSettings));
	};
});
