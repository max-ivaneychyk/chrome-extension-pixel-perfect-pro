
const state = {};
const browser = window.chrome;

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
		AppExtension.injectAppContainer(tab.id);
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
		browser.tabs.executeScript(tabId, {
			code: `
    ;(function() {
      const frame = document.querySelector("${AppExtension.APP_CONTAINER_ID}");
    
      if (frame) {
        frame.style.display = frame.style.display ? '' : 'none'
      }
    })();`
		});
	}

	static injectAppContainer (tabId) {
		browser.tabs.executeScript(tabId, {
			code: `
    ;(function() {
      const frame = document.createElement('div');
			frame.id = "${AppExtension.APP_CONTAINER_ID.slice(1)}";
			document.body.appendChild(frame);
    })();`
		});
	}

	static async isInjected(tabId) {
		return new Promise((resolve) => {

			browser.tabs.executeScript(tabId, {
				code: `
      ;(function() {
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

		// async actions
		// todo - fast click and hide while page loading
		browser.tabs.onUpdated.addListener(onUpdateTab);
		browser.browserAction.onClicked.addListener(onClick);
	}

	static injectJS () {
		throw new Error('Not implemented !')
	}
}


// My code
AppExtension.APP_CONTAINER_ID = '#react-app-ext';
AppExtension.injectJS = (tab) => {
	browser.tabs.insertCSS(tab.id, {
		file: 'all.css'
	});

	browser.tabs.executeScript(tab.id, {
		file: 'runtime.js'
	});

	browser.tabs.executeScript(tab.id, {
		file: 'chunk.js'
	});

	browser.tabs.executeScript(tab.id, {
		file: 'main.js'
	});
};

AppExtension.run();

