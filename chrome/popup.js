const KEY_DISABLE = 'live-preview-off';

function isDisable() {
    return localStorage.getItem(KEY_DISABLE);
}

function updateBtnContent(btn) {
    btn.innerHTML = isDisable() ? 'Enable on site' : 'Disable on site';
}

function toggleLivePreview(btn) {
    return () => {
        let data = {};



        if (isDisable()) {
            localStorage.removeItem(KEY_DISABLE);
            data[KEY_DISABLE] = '';
            chrome.storage.local.set(data, function() {
                console.log('Value is set to ');
            });
        } else  {
            localStorage.setItem(KEY_DISABLE, '1');
            data[KEY_DISABLE] = '1';
            chrome.storage.local.set(data, function() {
                console.log('Value is set to ');
            });
        }

        updateBtnContent(btn)
    }
}

// Set up event handlers and inject send_links.js into all frames in the active
// tab.
window.onload = function () {
    let btn = document.querySelector('#preview-toggle');
    btn.addEventListener('click', toggleLivePreview(btn));
    updateBtnContent(btn);
};
