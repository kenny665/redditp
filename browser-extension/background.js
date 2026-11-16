// Open redditp in a new tab, on the same path when launched from a Reddit page.
const openRedditp = (tab) => {
    let path = '';
    try {
        const url = new URL(tab.url);
        if (/(^|\.)reddit\.com$/.test(url.hostname))
            path = url.pathname.replace(/\/+$/, '') + url.search;
    } catch {
        // tab.url is missing on pages we have no access to (chrome://...)
    }
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html' + (path ? '?' + path : '')),
        index: tab.index + 1,
    });
};

chrome.action.onClicked.addListener(openRedditp);

chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'open-redditp')
        openRedditp(tab);
});
