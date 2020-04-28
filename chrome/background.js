const state = {};
const initialTabState = {
  toggle: false,
  status: 'off',
  injected: false
}

const set = (tabId, data) => {
  state[tabId] = {
    ...(state[tabId] || null),
    ...data
  }
}

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
    tab.id, { injected: true }
  )

}


function set_status(tab) {
  let { toggle, ...props } = state[tab.id] || initialTabState;
  toggle = !toggle;

  state[tab.id] = {
    ...props,
    toggle,
    status: toggle ? 'on' : 'off'
  }
}

function toggle_extension(tab) {
  injectJS(tab);

  chrome.tabs.executeScript(tab.id, {
    code: `
    ;(function() {
      const frame = document.querySelector('#react-app-ext');
    
      if (frame) {
        frame.style.display = frame.style.display ? '' : 'none'
      }
    })();
  `
  });
  // Set the tab id
  // the_tab_id = tab.id;
  //state[tab.id] = initialTabState
}

function my_listener(tabId, changeInfo, tab) {
  // If updated tab matches this one
  if (changeInfo.status === "complete" &&
    state[tabId] &&
    state[tabId].status === 'on'
  ) {
    set(
      tabId, { injected: false }
    )
    toggle_extension(tab);
  }
}

chrome.browserAction.onClicked.addListener(function (tab) {

  set_status(tab);
  toggle_extension(tab);
});

chrome.tabs.onUpdated.addListener(my_listener);

