const installedTabs = {};

const injectJS = (tab) => {
  console.log('inject');

  chrome.tabs.insertCSS({
    file: 'all.css'
  });

  chrome.tabs.executeScript({
    file: 'page.js'
  });

  chrome.tabs.executeScript({
    file: 'runtime.js'
  });

  chrome.tabs.executeScript({
    file: 'chunk.js'
  });

  chrome.tabs.executeScript({
    file: 'main.js'
  });

  installedTabs[tab.id] = {
    visible: true,
    url: tab.url
  };
}

chrome.tabs.onUpdated.addListener(function(tabId, _, tab){
  if (tab.status !== 'complete') {
    return;
  }

  if (installedTabs[tabId] && tab.url === installedTabs[tabId].url && installedTabs[tabId].visible) {

    injectJS(tab);
    return;
  }

  console.log('reset', tabId, tab);
  installedTabs[tabId] = null;
});


chrome.browserAction.onClicked.addListener(function (tab) {

  if (!installedTabs[tab.id]) {
    injectJS(tab);

    installedTabs[tab.id] = {
      visible: true,
      url: tab.url
    };

    return;
  }

  console.log('toggle');
  installedTabs[tab.id].visible = !installedTabs[tab.id].visible;
  chrome.tabs.executeScript({
    code: `
    ;(function() {
      const frame = document.querySelector('#react-app-ext');
    
      if (frame) {
        frame.style.display =  frame.style.display ? '' : 'none'
      }
    })();
  `
  });
});
