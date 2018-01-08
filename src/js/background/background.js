	// if the popup is opened and closed within this time, switch to the
	// previous tab
const MaxPopupLifetime = 450,
	WindowActivatedTimer = 500,
	TrackerID = "UA-108153491-3";


var gStartingUp = false;


console.log("= load");

chrome.runtime.onStartup.addListener(function() {
	var timer = null;

	gStartingUp = true;

console.log("== onStartup");

	function onLastActivated()
	{
		chrome.tabs.onActivated.removeListener(onActivated);

console.log("==== last onActivated");

		require([
			"background/recent-tabs"
		], function(
			recentTabs
		) {
// TODO: move this into a global function set inside the main require()
				// the stored recent tab data will be out of date, since the tabs
				// will get new IDs when the app reloads each one
			return recentTabs.updateAll()
				.then(function() {
console.log("===== updateAll done");

					gStartingUp = false;
				});
		});
	}


	function onActivated()
	{
		clearTimeout(timer);

console.log("=== onActivated");

			// set a timer to debounce this event, since if many windows are open,
			// this will get called once for each active tab in each window on startup
		timer = setTimeout(onLastActivated, WindowActivatedTimer);
	}


	chrome.tabs.onActivated.addListener(onActivated);
});


require([
	"background/recent-tabs",
	"background/tracker",
	"cp"
], function(
	recentTabs,
	Tracker,
	cp
) {
	var tracker;


	chrome.tabs.onActivated.addListener(function(event) {
		if (!gStartingUp) {
			return cp.tabs.get(event.tabId)
				.then(recentTabs.add);
		}
	});


	chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
		if (!gStartingUp) {
			recentTabs.remove(tabID, removeInfo);
		}
	});


		// the onActivated event isn't fired when the user switches between
		// windows, so get the active tab in this window and store it
	chrome.windows.onFocusChanged.addListener(function(windowID) {
		if (!gStartingUp && windowID != chrome.windows.WINDOW_ID_NONE) {
			cp.tabs.query({ active: true, windowId: windowID })
				.then(function(tabs) {
					if (tabs.length) {
							// pass true to let addTab() know that this change
							// is from alt-tabbing between windows, not switching
							// tabs within a window
						recentTabs.add(tabs[0], true);
					}
				});
		}
	});


	chrome.commands.onCommand.addListener(function(command) {
		if (command == "1-previous-tab") {
			recentTabs.toggleTab(-1);
			tracker.event("tabs", "previous");
		} else if (command == "2-next-tab") {
			recentTabs.toggleTab(1);
			tracker.event("tabs", "next");
		}
	});


	chrome.runtime.onConnect.addListener(function(port) {
		const connectTime = Date.now();

		port.onDisconnect.addListener(function() {
			if (Date.now() - connectTime < MaxPopupLifetime) {
					// pass true so toggleTab() knows this toggle is coming from
					// a double press of the shortcut
				recentTabs.toggleTab(-1, true);
				tracker.event("tabs", "toggle");
			}

				// send a background "pageview", since the popup is now closed,
				// so that GA will track the time the popup was open
			tracker.pageview();
		});
	});


	tracker = new Tracker(TrackerID, null, true);
	window.tracker = tracker;

	cp.management.getSelf()
		.then(function(info) {
			if (info.installType == "development") {
				tracker.set("campaignSource", "dev");
			}

				// setting appVersion: info.version seems to cause realtime
				// events to not appear on the GA site
			tracker.set({
				location: "/background.html",
				page: "/background"
			});
			tracker.pageview();
			tracker.timing("loading", "background", performance.now());
		});
});


window.log = function() {
	console.log.apply(console, arguments);
};

window.addEventListener("error", function(event) {
	window.tracker.exception(event, true);
});
