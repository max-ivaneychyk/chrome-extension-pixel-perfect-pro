chrome.browserAction.onClicked.addListener(function (tab) {
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
