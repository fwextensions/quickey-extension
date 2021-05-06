define([
	"shared"
], function(
	shared
) {
		// use navigator values instead of chrome.runtime.getPlatformInfo() so
		// we don't have to await the response everywhere constants are used
	const {userAgent, platform, languages} = navigator;
	const IsMac = /Mac/i.test(platform);
	const IsLinux = /Linux/i.test(platform);
	const IsEdge = /Edg\//i.test(userAgent);

	const languagePattern = /^(?<lang>[-a-z]+)-(?<locale>[a-z]+)$/i;
	const primaryLanguage = languages[0];
	const languageMatch = primaryLanguage.match(languagePattern);

	return shared("k", () => ({
		IsMac,
		IsLinux,
		Platform: IsMac ? "mac" : "win",
		Language: languageMatch && languageMatch.groups.lang || primaryLanguage,
			// this will get overridden in background.js if we're in dev mode
		IsDev: false,
		IsEdge,
		IncognitoNameUC: IsEdge ? "InPrivate" : "Incognito",
		IncognitoNameLC: IsEdge ? "InPrivate" : "incognito",
		SpaceBehavior: {
			Key: "spaceBehavior",
			Select: "select",
			Space: "space"
		},
		EscBehavior: {
			Key: "escBehavior",
			Clear: "clear",
			Close: "close"
		},
		HomeEndBehavior: {
			Key: "homeEndBehavior",
			ResultsList: "resultsList",
			SearchBox: "searchBox"
		},
		MarkTabsInOtherWindows: {
			Key: "markTabsInOtherWindows"
		},
		IncludeClosedTabs: {
			Key: "includeClosedTabs"
		},
		ShowTabCount: {
			Key: "showTabCount"
		},
		UsePinyin: {
			Key: "usePinyin"
		},
		RestoreLastQuery: {
			Key: "restoreLastQuery"
		},
		ShowBookmarkPaths: {
			Key: "showBookmarkPaths"
		},
		Shortcuts: {
			Key: "shortcuts",
			MRUSelect: "mruSelect",
			CloseTab: "closeTab",
			MoveTabLeft: "moveTabLeft",
			MoveTabRight: "moveTabRight",
			CopyURL: "copyURL",
			CopyTitleURL: "copyTitleURL",
			SelectPreviousItem: "selectPreviousItem",
			SelectNextItem: "selectNextItem",
			EscapeBehavior: "escapeBehavior",
		}
	}));
});
