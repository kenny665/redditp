// Remember the sound on/off state and volume of redgifs embeds (the iframes
// redditp shows), since every embed starts muted.
(() => {
    const KEY = 'redgifsSound';

    const waitFor = (find, timeoutMs = 15000) => new Promise((resolve) => {
        const found = find();
        if (found) return resolve(found);
        const observer = new MutationObserver(() => {
            const el = find();
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => { observer.disconnect(); resolve(null); }, timeoutMs);
    });

    const save = (changes) => chrome.storage.local.get(KEY).then((data) =>
        chrome.storage.local.set({ [KEY]: { ...data[KEY], ...changes } }));

    chrome.storage.local.get(KEY).then(async (data) => {
        const settings = { soundOn: false, volume: 1, ...data[KEY] };

        const video = await waitFor(() => document.querySelector('video'));
        if (!video) return;

        video.volume = Math.min(1, settings.volume);
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button[aria-label]');
            if (!button) return;
            if (button.matches("[aria-label='Sound Off']")) save({ soundOn: true });
            else if (button.matches("[aria-label='Sound On']")) save({ soundOn: false });
        }, true);
        video.addEventListener('volumechange', () => {
            if (!video.muted) save({ volume: video.volume });
        });

        // Click the redgifs button rather than setting video.muted, so its
        // UI stays in sync.
        if (settings.soundOn) {
            const soundOff = await waitFor(() => document.querySelector("[aria-label='Sound Off']"));
            if (soundOff) soundOff.click();
        }
        document.documentElement.dataset.redditpSound = settings.soundOn ? 'on' : 'off';
    });
})();
