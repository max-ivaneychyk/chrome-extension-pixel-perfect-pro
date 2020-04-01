const installedTabs = {};

chrome.browserAction.onClicked.addListener(function (tab) {

  if (!installedTabs[tab.id]) {

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

    installedTabs[tab.id] = true;
    return;
  }

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
