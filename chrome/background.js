const state = {};
const initialTabState = {
	toggle: false,
	status: 'off',
	injected: false
};

const set = (tabId, data) => {
	state[tabId] = {
		...(state[tabId] || null),
		...data
	}
};

class AppExtension {
	static toggle(tabId) {
		chrome.tabs.executeScript(tabId, {
			code: `
    ;(function() {
      const frame = document.querySelector("${AppExtension.APP_CONTAINER_ID}");
    
      if (frame) {
        frame.style.display = frame.style.display ? '' : 'none'
      }
    })();`
		});
	}

	static async isInjected(tabId) {
		return new Promise((resolve) => {
			chrome.tabs.executeScript(tabId, {
				code: `
      (function() {
        if( document.querySelector("${AppExtension.APP_CONTAINER_ID}") )  {
          return true
        }
      })();
      `,
			}, function (results) {
				if (!results || !results.length) {
					resolve();
					return;  // Permission error, tab closed, etc.
				}

				resolve(results[0]);
			});
		});
	}
}

AppExtension.APP_CONTAINER_ID = '#react-app-ext';

const injectJS = (tab) => {

	if (state[tab.id] && state[tab.id].injected) {
		return
	}


	chrome.tabs.insertCSS(tab.id, {
		file: 'all.css'
	});

	chrome.tabs.executeScript(tab.id, {
		file: 'page.js'
	});

	chrome.tabs.executeScript(tab.id, {
		file: 'runtime.js'
	});

	chrome.tabs.executeScript(tab.id, {
		file: 'chunk.js'
	});

	chrome.tabs.executeScript(tab.id, {
		file: 'main.js'
	});

	set(
		tab.id, {injected: true}
	)
};


function set_status(tab) {
	let {toggle, ...props} = state[tab.id] || initialTabState;
	toggle = !toggle;

	state[tab.id] = {
		...props,
		toggle,
		status: toggle ? 'on' : 'off'
	}
}

function toggle_extension(tab) {
	injectJS(tab);
	// Show / hide
	AppExtension.toggle(tab.id);
}

async function my_listener(tabId, changeInfo, tab) {
	// Check is injected scripts
	if (changeInfo.status === "complete" &&
		state[tabId]
	) {
		const injected = await AppExtension.isInjected(tabId);
		set(
			tabId, {injected}
		);
	}

	// If updated tab matches this one
	if (changeInfo.status === "complete" &&
		state[tabId] &&
		state[tabId].status === 'on'
	) {
		toggle_extension(tab);
	}
}

chrome.browserAction.onClicked.addListener(function (tab) {

	set_status(tab);
	toggle_extension(tab);
});

chrome.tabs.onUpdated.addListener(my_listener);

