const installedTabs = {};

const injectJS = (tab) => {

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


  installedTabs[tab.id].visible = !installedTabs[tab.id].visible;

  chrome.tabs.executeScript({
    code: `
    ;(function() {
      const frame = document.querySelector('#react-app-ext');
    
      if (frame) {
        frame.style.display =  ${!!installedTabs[tab.id].visible} ? '' : 'none'
      }
    })();
  `
  });
});
