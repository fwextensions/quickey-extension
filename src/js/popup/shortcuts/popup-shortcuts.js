define([
	"./shortcut-manager",
	"background/constants"
], function(
	ShortcutManager,
	k
) {
	const Bindings = [
		[["ArrowUp", "Ctrl+P", "Ctrl+K"], () => self.modifySelected(-1)],
		[["ArrowDown", "Ctrl+N", "Ctrl+J"], () => self.modifySelected(1)],
		["PageUp", () => self.resultsList.scrollByPage("up")],
		["PageDown", () => self.resultsList.scrollByPage("down")],
		[["Enter", "shift+Enter"], event => openItem(event, false)],
		[["mod+Enter", "mod+shift+Enter"], event => openItem(event, true)],
			// stop ctrl/cmd-F from closing the popup and opening the find menu
		["mod+F", () => {}],
		["Escape", event => self.clearQuery(event.target.value)],
		[["Home", "End"], event => {
			if (self.settings[k.HomeEndBehavior.Key] == k.HomeEndBehavior.ResultsList) {
				if (event.key == "Home") {
					self.setSelectedIndex(0)
				} else {
					self.setSelectedIndex(self.state.matchingItems.length - 1);
				}
			} else {
					// return true to let the input field handle the keys
				return true;
			}
		}],
		[["Space", "shift+Space"],
			event => {
				if (self.mode != "command" && self.settings[k.SpaceBehavior.Key] !== k.SpaceBehavior.Space) {
					self.modifySelected(event.shiftKey ? -1 : 1);
				} else {
						// in command mode, return true so that the space after
						// the /h or b isn't swallowed
					return true;
				}
			}]
	];
	const Manager = new ShortcutManager(Bindings);
	const Handlers = {
		[k.Shortcuts.CloseTab]: () => self.closeTab(selectedTab()),
		[k.Shortcuts.MoveTabLeft]: event => moveTab(-1, event.shiftKey),
		[k.Shortcuts.MoveTabRight]: event => moveTab(1, event.shiftKey),
		[k.Shortcuts.CopyURL]: () => self.copyItemURL(selectedTab(), false),
		[k.Shortcuts.CopyTitleURL]: () => self.copyItemURL(selectedTab(), true),
		[k.Shortcuts.SelectPreviousItem]: () => self.modifySelected(-1),
		[k.Shortcuts.SelectNextItem]: () => self.modifySelected(1),
		[k.Shortcuts.EscapeBehavior]: event => self.clearQuery(event.target.value),
	};
	const ShiftShortcuts = {
		[k.Shortcuts.MoveTabLeft]: 1,
		[k.Shortcuts.MoveTabRight]: 1
	};


		// the self module global will be set in handleEvent()
	let self;


	function selectedTab()
	{
		return self.state.matchingItems[self.state.selected];
	}


	function openItem(
		event,
		modKey)
	{
		self.openItem(selectedTab(), event.shiftKey, modKey);
	}


	function moveTab(
		direction,
		shiftKey)
	{
		if (self.mode == "tabs") {
			self.moveTab(selectedTab(), direction, shiftKey);
		}
	}


	function joinKeys(
		modifiers,
		baseKey)
	{
		return [].concat(modifiers).concat(baseKey).join("+");
	}


	return {
		update: function(
			settings)
		{
			const shortcuts = settings.shortcuts;
			const mruSelectKey = shortcuts[k.Shortcuts.MRUSelect];
			const popupModifiers = settings.chrome.popup.modifiers;

			Object.keys(shortcuts).forEach(function(id) {
				const handler = Handlers[id];
				const shortcut = [shortcuts[id]];

				if (handler) {
						// some customizable shortcuts use shift to unsuspend
						// the tab when performing the action
					if (id in ShiftShortcuts) {
						shortcut.push("shift+" + shortcut[0]);
					}

					Manager.bind(shortcut, handler);
				}
			});

				// add handlers for navigating up and down with the MRU key,
				// plus the modifiers used to open the popup.  pass true to let
				// the app know the MRU key was used, so that when the modifier
				// up event happens, the selected tab will be switched to
				// (unlike the plain up/down arrow keys bound above).
			Manager.bind([
				joinKeys(popupModifiers, "ArrowDown"),
				joinKeys(popupModifiers, mruSelectKey)
			], () => self.modifySelected(1, true));
			Manager.bind([
				joinKeys(popupModifiers, "ArrowUp"),
				joinKeys(popupModifiers.concat("shift"), mruSelectKey)
			], () => self.modifySelected(-1, true));
		},


		handleEvent: function(
			event,
			context)
		{
			self = context;

				// we only need to check for shortcuts if there's a modifier key
				// pressed or event.key is more than 1 char (ArrowUp, etc.)
			if (event.key.length > 1 || event.altKey || event.ctrlKey || event.metaKey ||
					event.shiftKey || event.key == " ") {
				return Manager.handleKeyEvent(event);
			}
		}
	};
});
