define([
	"react",
	"./key-constants",
	"background/constants"
], function(
	React,
	{FunctionKeyPattern},
	k
) {
	const MacModifiers = <span>⌘, ⌃ or ⌥</span>;
	const WinModifiers = <span><b>ctrl</b> or <b>alt</b></span>;
	const IncludeModifierMessage = <span>Include at least {k.IsMac ? MacModifiers : WinModifiers}</span>;


	function validateNoShift(
		key,
		modifiers,
		baseKey,
		shortcut)
	{
		const isShift = (key == "shift");

		return {
			isKeyAllowed: !isShift,
			isShortcutValid: !isShift && baseKey &&
				(modifiers.length || FunctionKeyPattern.test(baseKey)),
			errorMessage: (baseKey && modifiers.length == 0 && IncludeModifierMessage) ||
				(isShift && <span><b>shift</b> is used to unsuspend the tab while moving it</span>)
		};
	}


	function validateSomeModifier(
		key,
		modifiers,
		baseKey,
		shortcut)
	{
		return {
			isKeyAllowed: true,
			isShortcutValid: baseKey &&
				(modifiers.length || FunctionKeyPattern.test(baseKey)),
			errorMessage: baseKey && modifiers.length == 0 && IncludeModifierMessage
		};
	}


	return {
		customizable: [
			{
				id: k.Shortcuts.MRUSelect,
				placeholder: "Type a single character",
				createLabel: function(
					modifier)
				{
					return <span>Select the next tab while
						holding <b>{modifier}</b> (include <b>shift</b> to
						select the previous tab)</span>
				},
				createValidator: function(
					modifier,
					chromeKey)
				{
						// don't allow space as a navigation key
					const chromeKeyPattern = new RegExp("[ " + chromeKey + "]", "i");

					return function(
						key,
						modifiers,
						baseKey)
					{
						const matchesChromeKey = chromeKeyPattern.test(key);
						const isKeyAllowed = (!matchesChromeKey && modifiers.length == 0);

						return {
							isKeyAllowed: isKeyAllowed,
							isShortcutValid: isKeyAllowed && baseKey,
							errorMessage: (matchesChromeKey &&
								<span><b>{key.toUpperCase()}</b> is already in use for opening the QuicKey menu</span>) ||
								(modifiers.length &&
								<span>This key is used with <b>{modifier}</b> to navigate the QuicKey menu</span>)
						};
					};
				}
			},
			{
				id: k.Shortcuts.CloseTab,
				label: <span>Close the selected <b>tab</b>, or delete the selected <b>bookmark</b> or <b>history</b> item</span>,
				validate: validateSomeModifier
			},
			{
				id: k.Shortcuts.MoveTabLeft,
				label: <span>Move the selected tab to the <b>left</b> of the current tab</span>,
				validate: validateNoShift,
			},
			{
				id: k.Shortcuts.MoveTabRight,
				label: <span>Move the selected tab to the <b>right</b> of the current tab</span>,
				validate: validateNoShift,
			},
			{
				id: k.Shortcuts.CopyURL,
				label: <span>Copy the <b>URL</b> of the selected item</span>,
				validate: validateSomeModifier
			},
			{
				id: k.Shortcuts.CopyTitleURL,
				label: <span>Copy the <b>title and URL</b> of the selected item</span>,
				validate: validateSomeModifier
			},
			{
				id: k.Shortcuts.SelectPreviousItem,
				label: <span>Select the <b>previous</b> item.</span>,
				validate: validateSomeModifier
			},
			{
				id: k.Shortcuts.SelectNextItem,
				label: <span>Select the <b>next</b> item.</span>,
				validate: validateSomeModifier
			},
			{
				id: k.Shortcuts.EscapeBehavior,
				label: <span>Act as another <b>escape</b> key.</span>,
				validate: validateSomeModifier
			},
		],
		fixed: [
			{
				label: "Switch to the selected tab",
				shortcut: "enter",
				disabled: true
			},
			{
				label: <span>Open the selected bookmark or history item in the <b>same tab</b></span>,
				shortcut: "enter",
				disabled: true
			},
			{
				label: <span>Open the selected bookmark or history item in a <b>new tab</b></span>,
				shortcut: "mod+enter",
				disabled: true
			},
			{
				label: <span>Open the selected bookmark or history item in a <b>new window</b></span>,
				shortcut: "shift+enter",
				disabled: true
			},
		]
	};
});
