
const state = {};

const set = (tabId, data) => {
	state[tabId] = {
		...(state[tabId] || null),
		...data
	}
};

const tryShowExtension = async (tab) => {
	const injected = await AppExtension.isInjected(tab.id);

	if (injected) {
		AppExtension.toggle(tab.id)
	} else {
		AppExtension.injectJS(tab)
	}
};

async function onUpdateTab(tabId, changeInfo, tab) {
	// If updated tab matches this one
	if (changeInfo.status === "complete" &&
		state[tabId] &&
		state[tabId].status === 'on'
	) {
		await tryShowExtension(tab);
	}
}

async function onClick (tab) {
	const isOn = state[tab.id] && state[tab.id].status === 'on';

	set(tab.id, {status: isOn ? 'off' : 'on'});

	await tryShowExtension(tab)
}

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

	static run () {
		if (!AppExtension.APP_CONTAINER_ID) {
			throw new Error('Not implemented params <APP_CONTAINER_ID>')
		}

		chrome.browserAction.onClicked.addListener(onClick);
		chrome.tabs.onUpdated.addListener(onUpdateTab);
	}

	static injectJS () {
		throw new Error('Not implemented !')
	}
}


// My code
AppExtension.injectJS = (tab) => {
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
};

AppExtension.APP_CONTAINER_ID = '#react-app-ext';
AppExtension.run();

